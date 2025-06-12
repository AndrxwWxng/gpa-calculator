import './globals.css';
import GPAcalculator from '@/components/GPACalculator';

const MyApp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="container mx-auto">
        <GPAcalculator />
      </div>
    </div>
  );
}

export default MyApp;
