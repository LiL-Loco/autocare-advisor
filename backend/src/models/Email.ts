/**
 * Email Template Model - AutoCare Advisor
 * 
 * Manages reusable email templates with dynamic variable support
 * Supports HTML/Text content, categorization, and variable validation
 */

import mongoose, { Document, Schema } from 'mongoose';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

export interface IEmailTemplate extends Document {
  _id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  templateType: 'onboarding' | 'marketing' | 'transactional' | 'nurturing' | 'notification';
  templateCategory?: string;
  variables: string[];
  previewText?: string;
  isActive: boolean;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  renderTemplate(variables: Record<string, any>): Promise<{ subject: string; html: string; text?: string }>;
  validateVariables(variables: Record<string, any>): { isValid: boolean; missingVars: string[] };
  clone(newName: string): Promise<IEmailTemplate>;
}

export interface IEmailCampaign extends Document {
  _id: string;
  name: string;
  description?: string;
  templateId: string;
  
  // Targeting
  targetSegments: Record<string, any>;
  
  // Scheduling
  scheduleType: 'immediate' | 'scheduled' | 'triggered' | 'recurring';
  scheduledAt?: Date;
  triggerEvent?: string;
  triggerDelayHours: number;
  
  // Recurring
  recurringType?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  recurringDay?: number;
  
  // Status
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  
  // A/B Testing
  abTestEnabled: boolean;
  abTestSubjectB?: string;
  abTestSplitPercentage: number;
  
  // Limits
  maxSendsPerDay?: number;
  maxSendsTotal?: number;
  
  // Metadata
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;

  // Instance methods
  getTargetUsers(): Promise<any[]>;
  canSendToUser(userId: string): Promise<boolean>;
  getAnalytics(): Promise<any>;
}

export interface IEmailSequence extends Document {
  _id: string;
  name: string;
  description?: string;
  triggerEvent: string;
  isActive: boolean;
  steps: IEmailSequenceStep[];
  createdAt: Date;
}

export interface IEmailSequenceStep extends Document {
  _id: string;
  sequenceId: string;
  stepOrder: number;
  templateId: string;
  delayHours: number;
  conditions: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
}

export interface IEmailLog extends Document {
  _id: string;
  
  // Campaign Info
  campaignId?: string;
  sequenceId?: string;
  sequenceStepId?: string;
  templateId?: string;
  
  // Recipient
  recipientEmail: string;
  recipientId?: string;
  recipientName?: string;
  
  // Content
  subject?: string;
  templateVariables?: Record<string, any>;
  
  // A/B Testing
  abTestVariant?: 'A' | 'B';
  
  // Status
  status: 'queued' | 'sent' | 'delivered' | 'bounced' | 'failed';
  externalId?: string;
  
  // Engagement
  sentAt: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  firstClickedAt?: Date;
  lastClickedAt?: Date;
  bouncedAt?: Date;
  complainedAt?: Date;
  unsubscribedAt?: Date;
  
  // Click Tracking
  clickCount: number;
  uniqueClickCount: number;
  clickedLinks: string[];
  
  // Errors
  bounceReason?: string;
  errorMessage?: string;
  
  // Metadata
  sentFromIp?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface IEmailUnsubscribe extends Document {
  _id: string;
  email: string;
  userId?: string;
  unsubscribeType: 'all' | 'marketing' | 'transactional' | 'notifications';
  campaignTypes: string[];
  source?: string;
  campaignId?: string;
  unsubscribedAt: Date;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface IEmailPreferences extends Document {
  _id: string;
  userId: string;
  email: string;
  
  // Preferences
  marketingEnabled: boolean;
  transactionalEnabled: boolean;
  notificationsEnabled: boolean;
  weeklyReportsEnabled: boolean;
  monthlyReportsEnabled: boolean;
  
  // Frequency
  maxMarketingPerWeek: number;
  preferredSendTime: string;
  preferredTimezone: string;
  
  // Communication
  preferredLanguage: string;
  htmlEnabled: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// SCHEMAS
// ============================================================================

const EmailTemplateSchema = new Schema<IEmailTemplate>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  htmlContent: {
    type: String,
    required: true
  },
  textContent: {
    type: String,
    trim: true
  },
  templateType: {
    type: String,
    enum: ['onboarding', 'marketing', 'transactional', 'nurturing', 'notification'],
    default: 'marketing',
    required: true
  },
  templateCategory: {
    type: String,
    trim: true,
    maxlength: 50
  },
  variables: [{
    type: String,
    trim: true
  }],
  previewText: {
    type: String,
    trim: true,
    maxlength: 150
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const EmailCampaignSchema = new Schema<IEmailCampaign>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true
  },
  templateId: {
    type: String,
    ref: 'EmailTemplate',
    required: true
  },
  targetSegments: {
    type: Schema.Types.Mixed,
    default: {}
  },
  scheduleType: {
    type: String,
    enum: ['immediate', 'scheduled', 'triggered', 'recurring'],
    default: 'immediate',
    required: true
  },
  scheduledAt: {
    type: Date
  },
  triggerEvent: {
    type: String,
    trim: true
  },
  triggerDelayHours: {
    type: Number,
    default: 0,
    min: 0
  },
  recurringType: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'quarterly']
  },
  recurringDay: {
    type: Number,
    min: 1,
    max: 31
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'archived'],
    default: 'draft'
  },
  abTestEnabled: {
    type: Boolean,
    default: false
  },
  abTestSubjectB: {
    type: String,
    trim: true,
    maxlength: 200
  },
  abTestSplitPercentage: {
    type: Number,
    default: 50,
    min: 10,
    max: 90
  },
  maxSendsPerDay: {
    type: Number,
    min: 1
  },
  maxSendsTotal: {
    type: Number,
    min: 1
  },
  createdBy: {
    type: String,
    ref: 'User'
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const EmailSequenceSchema = new Schema<IEmailSequence>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true
  },
  triggerEvent: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const EmailSequenceStepSchema = new Schema<IEmailSequenceStep>({
  sequenceId: {
    type: String,
    ref: 'EmailSequence',
    required: true
  },
  stepOrder: {
    type: Number,
    required: true,
    min: 1
  },
  templateId: {
    type: String,
    ref: 'EmailTemplate',
    required: true
  },
  delayHours: {
    type: Number,
    default: 0,
    min: 0
  },
  conditions: {
    type: Schema.Types.Mixed,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const EmailLogSchema = new Schema<IEmailLog>({
  campaignId: {
    type: String,
    ref: 'EmailCampaign'
  },
  sequenceId: {
    type: String,
    ref: 'EmailSequence'
  },
  sequenceStepId: {
    type: String,
    ref: 'EmailSequenceStep'
  },
  templateId: {
    type: String,
    ref: 'EmailTemplate'
  },
  recipientEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  recipientId: {
    type: String,
    ref: 'User'
  },
  recipientName: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    trim: true
  },
  templateVariables: {
    type: Schema.Types.Mixed
  },
  abTestVariant: {
    type: String,
    enum: ['A', 'B']
  },
  status: {
    type: String,
    enum: ['queued', 'sent', 'delivered', 'bounced', 'failed'],
    default: 'queued'
  },
  externalId: {
    type: String,
    trim: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  deliveredAt: {
    type: Date
  },
  openedAt: {
    type: Date
  },
  firstClickedAt: {
    type: Date
  },
  lastClickedAt: {
    type: Date
  },
  bouncedAt: {
    type: Date
  },
  complainedAt: {
    type: Date
  },
  unsubscribedAt: {
    type: Date
  },
  clickCount: {
    type: Number,
    default: 0,
    min: 0
  },
  uniqueClickCount: {
    type: Number,
    default: 0,
    min: 0
  },
  clickedLinks: [{
    type: String
  }],
  bounceReason: {
    type: String,
    trim: true
  },
  errorMessage: {
    type: String,
    trim: true
  },
  sentFromIp: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const EmailUnsubscribeSchema = new Schema<IEmailUnsubscribe>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  userId: {
    type: String,
    ref: 'User'
  },
  unsubscribeType: {
    type: String,
    enum: ['all', 'marketing', 'transactional', 'notifications'],
    default: 'all'
  },
  campaignTypes: [{
    type: String,
    default: ['marketing']
  }],
  source: {
    type: String,
    trim: true
  },
  campaignId: {
    type: String,
    ref: 'EmailCampaign'
  },
  unsubscribedAt: {
    type: Date,
    default: Date.now
  },
  reason: {
    type: String,
    trim: true
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const EmailPreferencesSchema = new Schema<IEmailPreferences>({
  userId: {
    type: String,
    ref: 'User',
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  marketingEnabled: {
    type: Boolean,
    default: true
  },
  transactionalEnabled: {
    type: Boolean,
    default: true
  },
  notificationsEnabled: {
    type: Boolean,
    default: true
  },
  weeklyReportsEnabled: {
    type: Boolean,
    default: true
  },
  monthlyReportsEnabled: {
    type: Boolean,
    default: true
  },
  maxMarketingPerWeek: {
    type: Number,
    default: 3,
    min: 0,
    max: 10
  },
  preferredSendTime: {
    type: String,
    default: '10:00'
  },
  preferredTimezone: {
    type: String,
    default: 'Europe/Berlin'
  },
  preferredLanguage: {
    type: String,
    default: 'de',
    maxlength: 5
  },
  htmlEnabled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ============================================================================
// INDEXES
// ============================================================================

// Email Templates
EmailTemplateSchema.index({ templateType: 1 });
EmailTemplateSchema.index({ isActive: 1 });
EmailTemplateSchema.index({ createdAt: -1 });

// Email Campaigns
EmailCampaignSchema.index({ status: 1 });
EmailCampaignSchema.index({ triggerEvent: 1 });
EmailCampaignSchema.index({ scheduledAt: 1 });
EmailCampaignSchema.index({ templateId: 1 });

// Email Logs
EmailLogSchema.index({ campaignId: 1 });
EmailLogSchema.index({ recipientEmail: 1 });
EmailLogSchema.index({ status: 1 });
EmailLogSchema.index({ sentAt: -1 });
EmailLogSchema.index({ openedAt: -1 });

// Email Unsubscribes
EmailUnsubscribeSchema.index({ email: 1, unsubscribeType: 1 }, { unique: true });

// ============================================================================
// INSTANCE METHODS
// ============================================================================

// Email Template Methods
EmailTemplateSchema.methods.renderTemplate = async function(
  variables: Record<string, any>
): Promise<{ subject: string; html: string; text?: string }> {
  const template = this as IEmailTemplate;
  
  // Simple template rendering - replace {{variable}} with value
  const renderString = (str: string): string => {
    return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] || match;
    });
  };

  return {
    subject: renderString(template.subject),
    html: renderString(template.htmlContent),
    text: template.textContent ? renderString(template.textContent) : undefined
  };
};

EmailTemplateSchema.methods.validateVariables = function(
  variables: Record<string, any>
): { isValid: boolean; missingVars: string[] } {
  const template = this as IEmailTemplate;
  const missingVars = template.variables.filter(varName => !(varName in variables));
  
  return {
    isValid: missingVars.length === 0,
    missingVars
  };
};

EmailTemplateSchema.methods.clone = async function(newName: string): Promise<IEmailTemplate> {
  const template = this as IEmailTemplate;
  const EmailTemplate = mongoose.model<IEmailTemplate>('EmailTemplate');
  
  const cloned = new EmailTemplate({
    name: newName,
    subject: template.subject,
    htmlContent: template.htmlContent,
    textContent: template.textContent,
    templateType: template.templateType,
    templateCategory: template.templateCategory,
    variables: [...template.variables],
    previewText: template.previewText,
    isActive: false // Cloned templates start as inactive
  });
  
  return await cloned.save();
};

// ============================================================================
// STATIC METHODS
// ============================================================================

EmailTemplateSchema.statics.getByCategory = function(category: string) {
  return this.find({ templateCategory: category, isActive: true });
};

EmailCampaignSchema.statics.getActiveCampaigns = function() {
  return this.find({ status: 'active' });
};

EmailLogSchema.statics.getCampaignStats = async function(campaignId: string) {
  const stats = await this.aggregate([
    { $match: { campaignId } },
    {
      $group: {
        _id: null,
        totalSent: { $sum: 1 },
        delivered: { $sum: { $cond: [{ $ne: ['$deliveredAt', null] }, 1, 0] } },
        opened: { $sum: { $cond: [{ $ne: ['$openedAt', null] }, 1, 0] } },
        clicked: { $sum: { $cond: [{ $ne: ['$firstClickedAt', null] }, 1, 0] } },
        bounced: { $sum: { $cond: [{ $ne: ['$bouncedAt', null] }, 1, 0] } },
        unsubscribed: { $sum: { $cond: [{ $ne: ['$unsubscribedAt', null] }, 1, 0] } }
      }
    }
  ]);
  
  const result = stats[0] || {};
  const totalSent = result.totalSent || 0;
  
  return {
    totalSent,
    delivered: result.delivered || 0,
    opened: result.opened || 0,
    clicked: result.clicked || 0,
    bounced: result.bounced || 0,
    unsubscribed: result.unsubscribed || 0,
    deliveryRate: totalSent > 0 ? ((result.delivered || 0) / totalSent * 100).toFixed(2) : 0,
    openRate: totalSent > 0 ? ((result.opened || 0) / totalSent * 100).toFixed(2) : 0,
    clickRate: totalSent > 0 ? ((result.clicked || 0) / totalSent * 100).toFixed(2) : 0,
    unsubscribeRate: totalSent > 0 ? ((result.unsubscribed || 0) / totalSent * 100).toFixed(2) : 0
  };
};

// ============================================================================
// VIRTUAL FIELDS
// ============================================================================

EmailSequenceSchema.virtual('steps', {
  ref: 'EmailSequenceStep',
  localField: '_id',
  foreignField: 'sequenceId'
});

// ============================================================================
// EXPORT MODELS
// ============================================================================

export const EmailTemplate = mongoose.model<IEmailTemplate>('EmailTemplate', EmailTemplateSchema);
export const EmailCampaign = mongoose.model<IEmailCampaign>('EmailCampaign', EmailCampaignSchema);
export const EmailSequence = mongoose.model<IEmailSequence>('EmailSequence', EmailSequenceSchema);
export const EmailSequenceStep = mongoose.model<IEmailSequenceStep>('EmailSequenceStep', EmailSequenceStepSchema);
export const EmailLog = mongoose.model<IEmailLog>('EmailLog', EmailLogSchema);
export const EmailUnsubscribe = mongoose.model<IEmailUnsubscribe>('EmailUnsubscribe', EmailUnsubscribeSchema);
export const EmailPreferences = mongoose.model<IEmailPreferences>('EmailPreferences', EmailPreferencesSchema);

export default {
  EmailTemplate,
  EmailCampaign,
  EmailSequence,
  EmailSequenceStep,
  EmailLog,
  EmailUnsubscribe,
  EmailPreferences
};