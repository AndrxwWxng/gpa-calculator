import './globals.css';
import GPAcalculator from '@/components/GPACalculator';
import { ThemeToggle } from '@/components/theme-toggle';

const MyApp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-turquoise/5 dark:from-slate-900 dark:to-slate-800 py-6 px-4 transition-all duration-300">
      <div className="container mx-auto relative">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <GPAcalculator />
      </div>
    </div>
  );
}

export default MyApp;
