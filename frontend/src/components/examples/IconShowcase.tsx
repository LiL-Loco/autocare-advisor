// Beispiel für die Verwendung der benutzerdefinierten Icons
import {
  BrushIcon,
  BucketIcon,
  CarWashIcon,
  PolisherIcon,
  SoapIcon,
  SprayIcon,
  VacuumCleanerIcon,
  WashIcon,
} from '@/components/icons';

export default function IconExamples() {
  return (
    <div className="grid grid-cols-4 gap-6 p-6">
      <div className="text-center">
        <BrushIcon className="w-12 h-12 mx-auto mb-2 text-blue-600" />
        <p className="text-sm">Bürste</p>
      </div>

      <div className="text-center">
        <CarWashIcon className="w-12 h-12 mx-auto mb-2 text-green-600" />
        <p className="text-sm">Autowäsche</p>
      </div>

      <div className="text-center">
        <SoapIcon className="w-12 h-12 mx-auto mb-2 text-purple-600" />
        <p className="text-sm">Seife</p>
      </div>

      <div className="text-center">
        <SprayIcon className="w-12 h-12 mx-auto mb-2 text-orange-600" />
        <p className="text-sm">Spray</p>
      </div>

      <div className="text-center">
        <BucketIcon className="w-12 h-12 mx-auto mb-2 text-red-600" />
        <p className="text-sm">Eimer</p>
      </div>

      <div className="text-center">
        <WashIcon className="w-12 h-12 mx-auto mb-2 text-cyan-600" />
        <p className="text-sm">Waschen</p>
      </div>

      <div className="text-center">
        <PolisherIcon className="w-12 h-12 mx-auto mb-2 text-yellow-600" />
        <p className="text-sm">Poliermaschine</p>
      </div>

      <div className="text-center">
        <VacuumCleanerIcon className="w-12 h-12 mx-auto mb-2 text-gray-600" />
        <p className="text-sm">Staubsauger</p>
      </div>
    </div>
  );
}
