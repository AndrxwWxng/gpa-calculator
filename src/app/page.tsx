import './globals.css';
import GPAcalculator from '@/components/GPACalculator';
import { ThemeToggle } from '@/components/theme-toggle';

const MyApp = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-500">
      <div className="container mx-auto relative">
        <div className="absolute top-1 right-1 md:fixed md:top-6 md:right-6 z-50">
          <ThemeToggle />
        </div>
        <div className="pt-20 md:pt-16 pb-16">
          <GPAcalculator />
        </div>
      </div>
    </div>
  );
}

export default MyApp;
