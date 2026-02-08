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
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {code ? 'Completing sign in...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="text-center">
          <div className="text-6xl mb-6">🌤️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Weather App
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sign in to see real-time weather for your location
          </p>
          <Button onClick={login} size="lg" className="w-full">
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
