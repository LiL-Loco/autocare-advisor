/**
 * Brevo Email Service - AutoCare Advisor
 * 
 * Comprehensive Brevo integration for:
 * - Transactional emails
 * - Marketing campaigns 
 * - Template management
 * - Contact synchronization
 * - Webhook event handling
 * - Analytics tracking
 * 
 * Features:
 * - Template rendering with variables
 * - Batch sending capabilities
 * - GDPR-compliant unsubscribe handling
 * - Real-time event tracking via webhooks
 * - Contact list management
 * - Campaign automation
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { EmailLog, EmailTemplate, EmailUnsubscribe, EmailPreferences } from '../models/Email';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface BrevoConfig {
  apiKey: string;
  apiUrl?: string;
  timeout?: number;
  retryAttempts?: number;
}

export interface BrevoContact {
  email: string;
  firstName?: string;
  lastName?: string;
  attributes?: Record<string, any>;
  listIds?: number[];
  updateEnabled?: boolean;
}

export interface BrevoEmailRequest {
  to: Array<{
    email: string;
    name?: string;
  }>;
  templateId?: number;
  subject?: string;
  htmlContent?: string;
  textContent?: string;
  sender?: {
    email: string;
    name?: string;
  };
  replyTo?: {
    email: string;
    name?: string;
  };
  headers?: Record<string, string>;
  params?: Record<string, any>;
  tags?: string[];
  scheduledAt?: string;
}

export interface BrevoBatchEmailRequest {
  emails: BrevoEmailRequest[];
}

export interface BrevoTemplate {
  id: number;
  name: string;
  subject: string;
  isActive: boolean;
  htmlContent: string;
  textContent?: string;
  sender: {
    email: string;
    name?: string;
  };
  toField: string;
  createdAt: string;
  modifiedAt: string;
}

export interface BrevoCampaign {
  id: number;
  name: string;
  subject: string;
  type: 'classic' | 'trigger' | 'template';
  status: 'draft' | 'sent' | 'archive' | 'queued' | 'suspended' | 'in_process';
  scheduledAt?: string;
  recipients: {
    listIds: number[];
    exclusionListIds?: number[];
  };
  statistics?: {
    globalStats: {
      sent: number;
      delivered: number;
      opened: number;
      clicked: number;
      bounced: number;
      unsubscribed: number;
      hardBounces: number;
      softBounces: number;
      complaints: number;
    };
  };
}

export interface BrevoWebhookEvent {
  event: 'delivered' | 'opened' | 'clicked' | 'bounced' | 'blocked' | 'unsubscribed' | 'complaint';
  email: string;
  messageId: string;
  date: string;
  subject?: string;
  tag?: string;
  'message-id'?: string;
  'X-Mailin-custom'?: string;
  link?: string; // for click events
  reason?: string; // for bounce events
  'bounce-date'?: string;
  'bounce-type'?: 'hard' | 'soft';
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  recipientEmail: string;
  externalId?: string;
}

export interface CampaignStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  complaints: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
}

// ============================================================================
// BREVO EMAIL SERVICE
// ============================================================================

export class BrevoEmailService {
  private client: AxiosInstance;
  private config: BrevoConfig;

  constructor(config: BrevoConfig) {
    this.config = {
      apiUrl: 'https://api.brevo.com/v3',
      timeout: 30000,
      retryAttempts: 3,
      ...config
    };

    this.client = axios.create({
      baseURL: this.config.apiUrl,
      timeout: this.config.timeout,
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': this.config.apiKey
      }
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[Brevo] ${config.method?.toUpperCase()} ${config.url}`, {
          data: config.data ? JSON.stringify(config.data).substring(0, 200) : undefined
        });
        return config;
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 429) {
          // Rate limiting - wait and retry
          const retryAfter = error.response.headers['retry-after'] || 60;
          console.warn(`[Brevo] Rate limited, retrying after ${retryAfter}s`);
          await this.sleep(parseInt(retryAfter) * 1000);
          return this.client.request(error.config!);
        }
        throw error;
      }
    );
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    attempts: number = this.config.retryAttempts!
  ): Promise<T> {
    for (let i = 0; i < attempts; i++) {
      try {
        return await requestFn();
      } catch (error) {
        if (i === attempts - 1) throw error;
        if (error instanceof AxiosError && error.response?.status && error.response.status >= 500) {
          await this.sleep(Math.pow(2, i) * 1000); // Exponential backoff
        } else {
          throw error; // Don't retry client errors
        }
      }
    }
    throw new Error('Max retry attempts reached');
  }

  // ============================================================================
  // TRANSACTIONAL EMAIL METHODS
  // ============================================================================

  /**
   * Send a single transactional email
   */
  async sendTransactionalEmail(request: BrevoEmailRequest): Promise<EmailSendResult> {
    try {
      const response = await this.retryRequest(() => 
        this.client.post('/smtp/email', request)
      );

      const messageId = response.data?.messageId || `brevo_${Date.now()}`;
      
      // Log to database
      await this.logEmailSent({
        recipientEmail: request.to[0].email,
        recipientName: request.to[0].name,
        subject: request.subject,
        templateId: request.templateId?.toString(),
        templateVariables: request.params,
        status: 'sent',
        externalId: messageId,
        sentAt: new Date()
      });

      return {
        success: true,
        messageId,
        recipientEmail: request.to[0].email,
        externalId: messageId
      };
    } catch (error) {
      const errorMessage = this.parseError(error);
      
      // Log failed email
      await this.logEmailSent({
        recipientEmail: request.to[0].email,
        recipientName: request.to[0].name,
        subject: request.subject,
        templateId: request.templateId?.toString(),
        templateVariables: request.params,
        status: 'failed',
        errorMessage,
        sentAt: new Date()
      });

      return {
        success: false,
        error: errorMessage,
        recipientEmail: request.to[0].email
      };
    }
  }

  /**
   * Send batch transactional emails
   */
  async sendBatchEmails(requests: BrevoEmailRequest[]): Promise<EmailSendResult[]> {
    const results: EmailSendResult[] = [];
    
    // Process in chunks of 50 (Brevo limit)
    const chunkSize = 50;
    for (let i = 0; i < requests.length; i += chunkSize) {
      const chunk = requests.slice(i, i + chunkSize);
      
      try {
        const batchRequest = {
          emails: chunk
        };

        const response = await this.retryRequest(() => 
          this.client.post('/smtp/email/batch', batchRequest)
        );

        // Process batch results
        if (response.data?.results) {
          for (let j = 0; j < chunk.length; j++) {
            const email = chunk[j];
            const result = response.data.results[j];
            
            if (result.success) {
              await this.logEmailSent({
                recipientEmail: email.to[0].email,
                recipientName: email.to[0].name,
                subject: email.subject,
                templateId: email.templateId?.toString(),
                templateVariables: email.params,
                status: 'sent',
                externalId: result.messageId,
                sentAt: new Date()
              });

              results.push({
                success: true,
                messageId: result.messageId,
                recipientEmail: email.to[0].email,
                externalId: result.messageId
              });
            } else {
              await this.logEmailSent({
                recipientEmail: email.to[0].email,
                recipientName: email.to[0].name,
                subject: email.subject,
                templateId: email.templateId?.toString(),
                templateVariables: email.params,
                status: 'failed',
                errorMessage: result.error,
                sentAt: new Date()
              });

              results.push({
                success: false,
                error: result.error,
                recipientEmail: email.to[0].email
              });
            }
          }
        }
      } catch (error) {
        const errorMessage = this.parseError(error);
        
        // Mark all emails in chunk as failed
        for (const email of chunk) {
          await this.logEmailSent({
            recipientEmail: email.to[0].email,
            recipientName: email.to[0].name,
            subject: email.subject,
            templateId: email.templateId?.toString(),
            templateVariables: email.params,
            status: 'failed',
            errorMessage,
            sentAt: new Date()
          });

          results.push({
            success: false,
            error: errorMessage,
            recipientEmail: email.to[0].email
          });
        }
      }
    }

    return results;
  }

  /**
   * Send email using template
   */
  async sendTemplateEmail(
    templateId: string,
    recipientEmail: string,
    recipientName: string,
    variables: Record<string, any> = {},
    options?: {
      sender?: { email: string; name?: string };
      replyTo?: { email: string; name?: string };
      tags?: string[];
    }
  ): Promise<EmailSendResult> {
    // Get template from database
    const template = await EmailTemplate.findById(templateId);
    if (!template) {
      return {
        success: false,
        error: 'Template not found',
        recipientEmail
      };
    }

    // Check if recipient is unsubscribed
    const isUnsubscribed = await this.isUnsubscribed(recipientEmail, template.templateType);
    if (isUnsubscribed) {
      return {
        success: false,
        error: 'Recipient is unsubscribed',
        recipientEmail
      };
    }

    // Render template
    const renderedTemplate = await template.renderTemplate(variables);
    
    const request: BrevoEmailRequest = {
      to: [{ email: recipientEmail, name: recipientName }],
      subject: renderedTemplate.subject,
      htmlContent: renderedTemplate.html,
      textContent: renderedTemplate.text,
      params: variables,
      tags: [template.templateType, template.templateCategory || 'general'].filter(Boolean),
      ...options
    };

    return this.sendTransactionalEmail(request);
  }

  // ============================================================================
  // TEMPLATE MANAGEMENT
  // ============================================================================

  /**
   * Create Brevo template from local template
   */
  async createBrevoTemplate(localTemplateId: string): Promise<{ success: boolean; brevoTemplateId?: number; error?: string }> {
    try {
      const template = await EmailTemplate.findById(localTemplateId);
      if (!template) {
        return { success: false, error: 'Local template not found' };
      }

      const brevoTemplate = {
        templateName: template.name,
        subject: template.subject,
        htmlContent: template.htmlContent,
        textContent: template.textContent,
        isActive: template.isActive,
        sender: {
          email: process.env.FROM_EMAIL || 'noreply@autocare-advisor.com',
          name: process.env.FROM_NAME || 'AutoCare Advisor'
        },
        toField: '{{contact.EMAIL}}'
      };

      const response = await this.client.post('/smtp/templates', brevoTemplate);
      
      return {
        success: true,
        brevoTemplateId: response.data.id
      };
    } catch (error) {
      return {
        success: false,
        error: this.parseError(error)
      };
    }
  }

  /**
   * Get all Brevo templates
   */
  async getBrevoTemplates(): Promise<BrevoTemplate[]> {
    try {
      const response = await this.client.get('/smtp/templates');
      return response.data.templates || [];
    } catch (error) {
      console.error('[Brevo] Failed to fetch templates:', error);
      return [];
    }
  }

  /**
   * Update Brevo template
   */
  async updateBrevoTemplate(templateId: number, updates: Partial<BrevoTemplate>): Promise<boolean> {
    try {
      await this.client.put(`/smtp/templates/${templateId}`, updates);
      return true;
    } catch (error) {
      console.error('[Brevo] Failed to update template:', error);
      return false;
    }
  }

  // ============================================================================
  // CONTACT MANAGEMENT
  // ============================================================================

  /**
   * Create or update contact
   */
  async upsertContact(contact: BrevoContact): Promise<{ success: boolean; error?: string }> {
    try {
      const contactData = {
        email: contact.email,
        attributes: {
          FIRSTNAME: contact.firstName,
          LASTNAME: contact.lastName,
          ...contact.attributes
        },
        listIds: contact.listIds,
        updateEnabled: contact.updateEnabled !== false
      };

      await this.client.post('/contacts', contactData);
      
      return { success: true };
    } catch (error) {
      // If contact already exists, try to update
      if (error instanceof AxiosError && error.response?.status === 400) {
        try {
          const updateData = {
            attributes: {
              FIRSTNAME: contact.firstName,
              LASTNAME: contact.lastName,
              ...contact.attributes
            },
            listIds: contact.listIds
          };
          
          await this.client.put(`/contacts/${encodeURIComponent(contact.email)}`, updateData);
          return { success: true };
        } catch (updateError) {
          return { success: false, error: this.parseError(updateError) };
        }
      }
      
      return { success: false, error: this.parseError(error) };
    }
  }

  /**
   * Add contact to list
   */
  async addContactToList(email: string, listId: number): Promise<boolean> {
    try {
      await this.client.post(`/contacts/lists/${listId}/contacts/add`, {
        emails: [email]
      });
      return true;
    } catch (error) {
      console.error('[Brevo] Failed to add contact to list:', error);
      return false;
    }
  }

  /**
   * Remove contact from list
   */
  async removeContactFromList(email: string, listId: number): Promise<boolean> {
    try {
      await this.client.post(`/contacts/lists/${listId}/contacts/remove`, {
        emails: [email]
      });
      return true;
    } catch (error) {
      console.error('[Brevo] Failed to remove contact from list:', error);
      return false;
    }
  }

  // ============================================================================
  // CAMPAIGN MANAGEMENT
  // ============================================================================

  /**
   * Create email campaign
   */
  async createCampaign(campaign: {
    name: string;
    subject: string;
    templateId?: number;
    htmlContent?: string;
    textContent?: string;
    listIds: number[];
    exclusionListIds?: number[];
    scheduledAt?: Date;
    sender?: { email: string; name?: string };
    replyTo?: { email: string; name?: string };
  }): Promise<{ success: boolean; campaignId?: number; error?: string }> {
    try {
      const campaignData = {
        name: campaign.name,
        subject: campaign.subject,
        templateId: campaign.templateId,
        htmlContent: campaign.htmlContent,
        textContent: campaign.textContent,
        sender: campaign.sender || {
          email: process.env.FROM_EMAIL || 'noreply@autocare-advisor.com',
          name: process.env.FROM_NAME || 'AutoCare Advisor'
        },
        replyTo: campaign.replyTo,
        recipients: {
          listIds: campaign.listIds,
          exclusionListIds: campaign.exclusionListIds
        },
        scheduledAt: campaign.scheduledAt?.toISOString()
      };

      const response = await this.client.post('/emailCampaigns', campaignData);
      
      return {
        success: true,
        campaignId: response.data.id
      };
    } catch (error) {
      return {
        success: false,
        error: this.parseError(error)
      };
    }
  }

  /**
   * Get campaign statistics
   */
  async getCampaignStats(campaignId: number): Promise<CampaignStats | null> {
    try {
      const response = await this.client.get(`/emailCampaigns/${campaignId}`);
      const stats = response.data.statistics?.globalStats;
      
      if (!stats) return null;

      const sent = stats.sent || 0;
      
      return {
        sent,
        delivered: stats.delivered || 0,
        opened: stats.opened || 0,
        clicked: stats.clicked || 0,
        bounced: stats.bounced || 0,
        unsubscribed: stats.unsubscribed || 0,
        complaints: stats.complaints || 0,
        deliveryRate: sent > 0 ? ((stats.delivered || 0) / sent * 100) : 0,
        openRate: sent > 0 ? ((stats.opened || 0) / sent * 100) : 0,
        clickRate: sent > 0 ? ((stats.clicked || 0) / sent * 100) : 0,
        unsubscribeRate: sent > 0 ? ((stats.unsubscribed || 0) / sent * 100) : 0
      };
    } catch (error) {
      console.error('[Brevo] Failed to get campaign stats:', error);
      return null;
    }
  }

  // ============================================================================
  // WEBHOOK EVENT HANDLING
  // ============================================================================

  /**
   * Process Brevo webhook event
   */
  async processWebhookEvent(event: BrevoWebhookEvent): Promise<void> {
    try {
      // Find the email log entry
      const emailLog = await EmailLog.findOne({
        $or: [
          { externalId: event.messageId },
          { externalId: event['message-id'] },
          { recipientEmail: event.email, sentAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
        ]
      }).sort({ sentAt: -1 });

      if (!emailLog) {
        console.warn(`[Brevo] Email log not found for webhook event:`, event);
        return;
      }

      // Update email log based on event type
      const updates: any = {};
      const eventDate = new Date(event.date);

      switch (event.event) {
        case 'delivered':
          updates.status = 'delivered';
          updates.deliveredAt = eventDate;
          break;

        case 'opened':
          if (!emailLog.openedAt) {
            updates.openedAt = eventDate;
          }
          break;

        case 'clicked':
          if (!emailLog.firstClickedAt) {
            updates.firstClickedAt = eventDate;
          }
          updates.lastClickedAt = eventDate;
          updates.$inc = { clickCount: 1 };
          
          if (event.link && !emailLog.clickedLinks.includes(event.link)) {
            updates.$addToSet = { clickedLinks: event.link };
            updates.$inc = { ...updates.$inc, uniqueClickCount: 1 };
          }
          break;

        case 'bounced':
          updates.status = 'bounced';
          updates.bouncedAt = eventDate;
          updates.bounceReason = event.reason;
          break;

        case 'blocked':
          updates.status = 'failed';
          updates.errorMessage = event.reason || 'Email blocked';
          break;

        case 'unsubscribed':
          updates.unsubscribedAt = eventDate;
          
          // Add to unsubscribe list
          await EmailUnsubscribe.create({
            email: event.email,
            unsubscribeType: 'marketing',
            campaignTypes: ['marketing'],
            source: 'brevo_webhook',
            unsubscribedAt: eventDate
          });
          break;

        case 'complaint':
          updates.complainedAt = eventDate;
          
          // Mark as unsubscribed due to complaint
          await EmailUnsubscribe.create({
            email: event.email,
            unsubscribeType: 'all',
            campaignTypes: ['all'],
            source: 'spam_complaint',
            reason: 'Spam complaint',
            unsubscribedAt: eventDate
          });
          break;
      }

      // Update the email log
      if (Object.keys(updates).length > 0) {
        await EmailLog.updateOne({ _id: emailLog._id }, updates);
      }

    } catch (error) {
      console.error('[Brevo] Failed to process webhook event:', error);
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private async logEmailSent(logData: {
    recipientEmail: string;
    recipientName?: string;
    subject?: string;
    templateId?: string;
    campaignId?: string;
    sequenceId?: string;
    sequenceStepId?: string;
    templateVariables?: Record<string, any>;
    status: 'queued' | 'sent' | 'delivered' | 'bounced' | 'failed';
    externalId?: string;
    errorMessage?: string;
    sentAt: Date;
  }): Promise<void> {
    try {
      const emailLog = new EmailLog({
        ...logData,
        clickCount: 0,
        uniqueClickCount: 0,
        clickedLinks: []
      });
      
      await emailLog.save();
    } catch (error) {
      console.error('[Brevo] Failed to log email:', error);
    }
  }

  private async isUnsubscribed(email: string, emailType: string): Promise<boolean> {
    const unsubscribe = await EmailUnsubscribe.findOne({
      email: email.toLowerCase(),
      $or: [
        { unsubscribeType: 'all' },
        { unsubscribeType: emailType },
        { campaignTypes: emailType }
      ]
    });

    return !!unsubscribe;
  }

  private parseError(error: any): string {
    if (error instanceof AxiosError) {
      if (error.response?.data?.message) {
        return error.response.data.message;
      }
      if (error.response?.data?.error) {
        return error.response.data.error;
      }
      return error.message;
    }
    
    if (error instanceof Error) {
      return error.message;
    }
    
    return String(error);
  }

  /**
   * Test connection to Brevo
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.client.get('/account');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: this.parseError(error)
      };
    }
  }

  /**
   * Get account information
   */
  async getAccountInfo(): Promise<any> {
    try {
      const response = await this.client.get('/account');
      return response.data;
    } catch (error) {
      console.error('[Brevo] Failed to get account info:', error);
      return null;
    }
  }
}

// ============================================================================
// FACTORY & EXPORTS
// ============================================================================

let brevoService: BrevoEmailService | null = null;

export function createBrevoService(config?: BrevoConfig): BrevoEmailService {
  if (!brevoService) {
    const apiKey = config?.apiKey || process.env.BREVO_API_KEY;
    if (!apiKey) {
      throw new Error('Brevo API key is required');
    }

    brevoService = new BrevoEmailService({
      apiKey,
      ...config
    });
  }
  
  return brevoService;
}

export function getBrevoService(): BrevoEmailService {
  if (!brevoService) {
    throw new Error('Brevo service not initialized. Call createBrevoService() first.');
  }
  return brevoService;
}

export default BrevoEmailService;