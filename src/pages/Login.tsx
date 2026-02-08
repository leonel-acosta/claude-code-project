import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks';
import { Button, Card, CardContent, Spinner } from '../components/ui';

export function Login() {
  const { login, handleAuthCallback, isAuthenticated, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const code = searchParams.get('code');

  useEffect(() => {
    if (code) {
      handleAuthCallback(code)
        .then(() => {
          navigate('/', { replace: true });
        })
        .catch((error) => {
          console.error('Auth failed:', error);
        });
    }
  }, [code, handleAuthCallback, navigate]);

  useEffect(() => {
    if (isAuthenticated && !code) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, code, navigate]);

  if (isLoading || code) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto" />
          <p className="mt-6 text-slate-600 dark:text-slate-400 font-medium">
            {code ? 'Completing sign in...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="text-center">
          <div className="text-7xl mb-6 animate-bounce" style={{ animationDuration: '3s' }}>
            🌤️
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Weather
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
            Check real-time weather for your location
          </p>
          <Button onClick={login} size="lg" className="w-full">
            🔐 Sign in with Google
          </Button>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-6">
            We only access your location and basic profile information
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
