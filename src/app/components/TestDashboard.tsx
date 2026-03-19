// Test Dashboard untuk verifikasi semua integrasi

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle2, XCircle, Loader2, PlayCircle, Database, Send, Mail, Settings, Zap, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-1a9814d3`;

interface TestResult {
  status: 'idle' | 'loading' | 'success' | 'error';
  data?: any;
  message?: string;
}

interface LoadTestResult {
  bookingId: string;
  status: 'success' | 'error';
  responseTime: number;
  error?: string;
}

interface LoadTestStats {
  total: number;
  success: number;
  failed: number;
  avgResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
}

export function TestDashboard() {
  const [envTest, setEnvTest] = useState<TestResult>({ status: 'idle' });
  const [airtableTest, setAirtableTest] = useState<TestResult>({ status: 'idle' });
  const [telegramTest, setTelegramTest] = useState<TestResult>({ status: 'idle' });
  const [emailTest, setEmailTest] = useState<TestResult>({ status: 'idle' });
  const [fullTest, setFullTest] = useState<TestResult>({ status: 'idle' });
  
  // Load Testing State
  const [loadTestQuantity, setLoadTestQuantity] = useState<number>(10);
  const [loadTestMode, setLoadTestMode] = useState<'concurrent' | 'sequential'>('concurrent');
  const [loadTestStatus, setLoadTestStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [loadTestProgress, setLoadTestProgress] = useState<number>(0);
  const [loadTestResults, setLoadTestResults] = useState<LoadTestResult[]>([]);
  const [loadTestStats, setLoadTestStats] = useState<LoadTestStats | null>(null);

  const runTest = async (
    endpoint: string,
    setter: (result: TestResult) => void
  ) => {
    setter({ status: 'loading' });
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();
      
      if (data.status === 'success' || data.status === 'partial') {
        setter({ 
          status: 'success', 
          data,
          message: data.message 
        });
      } else {
        setter({ 
          status: 'error', 
          data,
          message: data.message || 'Test failed' 
        });
      }
    } catch (error) {
      setter({ 
        status: 'error', 
        message: error.message || 'Network error' 
      });
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'loading') return <Loader2 className="size-5 animate-spin text-blue-500" />;
    if (status === 'success') return <CheckCircle2 className="size-5 text-green-500" />;
    if (status === 'error') return <XCircle className="size-5 text-red-500" />;
    return <div className="size-5 rounded-full border-2 border-gray-300" />;
  };

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'loading') return <Badge variant="outline" className="bg-blue-50">Testing...</Badge>;
    if (status === 'success') return <Badge className="bg-green-500">Success</Badge>;
    if (status === 'error') return <Badge variant="destructive">Failed</Badge>;
    return <Badge variant="outline">Not Tested</Badge>;
  };

  // Generate random test booking data
  const generateTestBooking = (index: number) => {
    const names = ['Ahmad Reza', 'Siti Nurhaliza', 'Budi Santoso', 'Rina Lestari', 'Dewi Kusuma', 'Andi Wijaya', 'Maya Putri', 'Agus Susanto'];
    const services = ['Facial Brightening', 'Skin Rejuvenation', 'Laser Treatment', 'Acne Treatment', 'Anti-Aging Therapy'];
    const dates = ['2026-03-20', '2026-03-21', '2026-03-22', '2026-03-23', '2026-03-24'];
    const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomService = services[Math.floor(Math.random() * services.length)];
    const randomDate = dates[Math.floor(Math.random() * dates.length)];
    const randomTime = times[Math.floor(Math.random() * times.length)];
    
    return {
      full_name: `${randomName} #${index}`,
      phone_number: `+628${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      email: `test${index}@agencynexus.com`,
      service_interest: randomService,
      preferred_date: randomDate,
      preferred_time: randomTime,
      notes: `Load test booking #${index}`
    };
  };

  // Single booking submission
  const submitSingleBooking = async (index: number): Promise<LoadTestResult> => {
    const startTime = performance.now();
    
    try {
      const bookingData = generateTestBooking(index);
      
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);

      if (response.ok && result.success === true) {
        return {
          bookingId: result.data?.booking_id || `BOOK-${index}`,
          status: 'success',
          responseTime
        };
      } else {
        return {
          bookingId: `FAILED-${index}`,
          status: 'error',
          responseTime,
          error: result.message || 'Unknown error'
        };
      }
    } catch (error) {
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      return {
        bookingId: `ERROR-${index}`,
        status: 'error',
        responseTime,
        error: error.message || 'Network error'
      };
    }
  };

  // Run load test
  const runLoadTest = async () => {
    setLoadTestStatus('running');
    setLoadTestProgress(0);
    setLoadTestResults([]);
    setLoadTestStats(null);

    const results: LoadTestResult[] = [];
    
    try {
      if (loadTestMode === 'concurrent') {
        // Concurrent mode: send all requests at once
        const promises = Array.from({ length: loadTestQuantity }, (_, i) => 
          submitSingleBooking(i + 1).then(result => {
            results.push(result);
            setLoadTestProgress(Math.round((results.length / loadTestQuantity) * 100));
            setLoadTestResults([...results]);
            return result;
          })
        );
        
        await Promise.all(promises);
      } else {
        // Sequential mode: send requests one by one
        for (let i = 0; i < loadTestQuantity; i++) {
          const result = await submitSingleBooking(i + 1);
          results.push(result);
          setLoadTestProgress(Math.round(((i + 1) / loadTestQuantity) * 100));
          setLoadTestResults([...results]);
        }
      }

      // Calculate statistics
      const successCount = results.filter(r => r.status === 'success').length;
      const failedCount = results.filter(r => r.status === 'error').length;
      const responseTimes = results.map(r => r.responseTime);
      const avgResponseTime = Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length);
      const minResponseTime = Math.min(...responseTimes);
      const maxResponseTime = Math.max(...responseTimes);

      setLoadTestStats({
        total: loadTestQuantity,
        success: successCount,
        failed: failedCount,
        avgResponseTime,
        minResponseTime,
        maxResponseTime
      });

      setLoadTestStatus('completed');
    } catch (error) {
      console.error('Load test error:', error);
      setLoadTestStatus('error');
    }
  };

  const clearLoadTestResults = () => {
    setLoadTestStatus('idle');
    setLoadTestProgress(0);
    setLoadTestResults([]);
    setLoadTestStats(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="size-6" />
            Integration Test Dashboard
          </CardTitle>
          <CardDescription>
            Test all external service integrations: Airtable, Telegram, and Email (Resend)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Environment Variables Check */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Settings className="size-5 text-gray-500" />
              <div>
                <p className="font-medium">Environment Variables</p>
                <p className="text-sm text-muted-foreground">
                  Check if all secrets are configured
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={envTest.status} />
              <StatusIcon status={envTest.status} />
              <Button
                size="sm"
                onClick={() => runTest('/test/env', setEnvTest)}
                disabled={envTest.status === 'loading'}
              >
                <PlayCircle className="size-4 mr-2" />
                Test
              </Button>
            </div>
          </div>

          {/* Environment Variables Result */}
          {envTest.status === 'success' && envTest.data && (
            <div className="ml-8 p-3 bg-gray-50 rounded-lg text-sm">
              <p className="font-medium mb-2">Configuration Status:</p>
              <div className="space-y-1">
                {Object.entries(envTest.data.variables).map(([service, vars]: [string, any]) => (
                  <div key={service}>
                    <span className="font-medium capitalize">{service}:</span>
                    {Object.entries(vars).map(([key, value]: [string, any]) => (
                      <span key={key} className="ml-2">
                        {key} {value ? '✅' : '❌'}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Airtable Test */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Database className="size-5 text-orange-500" />
              <div>
                <p className="font-medium">Airtable Database</p>
                <p className="text-sm text-muted-foreground">
                  Test create Lead and Appointment records
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={airtableTest.status} />
              <StatusIcon status={airtableTest.status} />
              <Button
                size="sm"
                onClick={() => runTest('/test/airtable', setAirtableTest)}
                disabled={airtableTest.status === 'loading'}
              >
                <PlayCircle className="size-4 mr-2" />
                Test
              </Button>
            </div>
          </div>

          {/* Airtable Result */}
          {airtableTest.status === 'success' && airtableTest.data?.data && (
            <div className="ml-8 p-3 bg-green-50 rounded-lg text-sm">
              <p className="font-medium text-green-700 mb-2">✅ {airtableTest.message}</p>
              <p>Lead ID: <code className="bg-white px-2 py-1 rounded">{airtableTest.data.data.lead_id}</code></p>
              <p>Appointment ID: <code className="bg-white px-2 py-1 rounded">{airtableTest.data.data.appointment_id}</code></p>
            </div>
          )}
          {airtableTest.status === 'error' && (
            <div className="ml-8 p-3 bg-red-50 rounded-lg text-sm text-red-700">
              ❌ {airtableTest.message}
            </div>
          )}

          {/* Telegram Test */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Send className="size-5 text-blue-500" />
              <div>
                <p className="font-medium">Telegram Notification</p>
                <p className="text-sm text-muted-foreground">
                  Test send message to admin group
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={telegramTest.status} />
              <StatusIcon status={telegramTest.status} />
              <Button
                size="sm"
                onClick={() => runTest('/test/telegram', setTelegramTest)}
                disabled={telegramTest.status === 'loading'}
              >
                <PlayCircle className="size-4 mr-2" />
                Test
              </Button>
            </div>
          </div>

          {/* Telegram Result */}
          {telegramTest.status === 'success' && (
            <div className="ml-8 p-3 bg-green-50 rounded-lg text-sm">
              <p className="font-medium text-green-700">✅ {telegramTest.message}</p>
              <p className="text-muted-foreground mt-1">{telegramTest.data?.note}</p>
            </div>
          )}
          {telegramTest.status === 'error' && (
            <div className="ml-8 p-3 bg-red-50 rounded-lg text-sm text-red-700">
              ❌ {telegramTest.message}
            </div>
          )}

          {/* Email Test */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="size-5 text-purple-500" />
              <div>
                <p className="font-medium">Email Notification (Resend)</p>
                <p className="text-sm text-muted-foreground">
                  Test send email to admin
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={emailTest.status} />
              <StatusIcon status={emailTest.status} />
              <Button
                size="sm"
                onClick={() => runTest('/test/email', setEmailTest)}
                disabled={emailTest.status === 'loading'}
              >
                <PlayCircle className="size-4 mr-2" />
                Test
              </Button>
            </div>
          </div>

          {/* Email Result */}
          {emailTest.status === 'success' && (
            <div className="ml-8 p-3 bg-green-50 rounded-lg text-sm">
              <p className="font-medium text-green-700">✅ {emailTest.message}</p>
              <p className="text-muted-foreground mt-1">{emailTest.data?.note}</p>
            </div>
          )}
          {emailTest.status === 'error' && (
            <div className="ml-8 p-3 bg-red-50 rounded-lg text-sm text-red-700">
              ❌ {emailTest.message}
            </div>
          )}

          {/* Full Integration Test */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between p-4 border-2 border-dashed rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-6 text-green-500" />
                <div>
                  <p className="font-bold">Full Integration Test</p>
                  <p className="text-sm text-muted-foreground">
                    Test all services together (creates real data + sends notifications)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={fullTest.status} />
                <StatusIcon status={fullTest.status} />
                <Button
                  size="lg"
                  onClick={() => runTest('/test/all', setFullTest)}
                  disabled={fullTest.status === 'loading'}
                  className="bg-gradient-to-r from-blue-500 to-purple-500"
                >
                  <PlayCircle className="size-5 mr-2" />
                  Run Full Test
                </Button>
              </div>
            </div>

            {/* Full Test Result */}
            {fullTest.status === 'success' && fullTest.data?.results && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="font-bold text-green-700 mb-3">✅ {fullTest.message}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Database className="size-4" />
                    <span>Airtable:</span>
                    {fullTest.data.results.airtable?.status === 'success' ? (
                      <span className="text-green-600">
                        ✅ Lead: {fullTest.data.results.airtable.lead_id} | 
                        Appointment: {fullTest.data.results.airtable.appointment_id}
                      </span>
                    ) : (
                      <span className="text-red-600">❌ {fullTest.data.results.airtable?.message}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Send className="size-4" />
                    <span>Telegram:</span>
                    {fullTest.data.results.telegram?.status === 'success' ? (
                      <span className="text-green-600">✅ Sent</span>
                    ) : (
                      <span className="text-red-600">❌ {fullTest.data.results.telegram?.message}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="size-4" />
                    <span>Email:</span>
                    {fullTest.data.results.email?.status === 'success' ? (
                      <span className="text-green-600">✅ Sent</span>
                    ) : (
                      <span className="text-red-600">❌ {fullTest.data.results.email?.message}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
            {fullTest.status === 'error' && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg text-red-700">
                ❌ Full test failed: {fullTest.message}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Load Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="size-6 text-amber-500" />
            Load Testing - Bulk Booking Simulation
          </CardTitle>
          <CardDescription>
            Test system performance with multiple concurrent booking submissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration Section */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="size-5" />
              Test Configuration
            </h3>
            
            {/* Quantity Selection */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Number of Bookings:
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {[5, 10, 25, 50, 100].map(qty => (
                    <button
                      key={qty}
                      onClick={() => setLoadTestQuantity(qty)}
                      disabled={loadTestStatus === 'running'}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        loadTestQuantity === qty
                          ? 'bg-amber-500 text-white shadow-md'
                          : 'bg-white text-gray-700 border border-gray-300 hover:border-amber-400'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {qty}
                    </button>
                  ))}
                  <input
                    type="number"
                    value={loadTestQuantity}
                    onChange={(e) => setLoadTestQuantity(Math.max(1, Math.min(500, Number(e.target.value))))}
                    disabled={loadTestStatus === 'running'}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg font-mono disabled:opacity-50"
                    min="1"
                    max="500"
                    placeholder="Custom"
                  />
                </div>
              </div>

              {/* Mode Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Test Mode:
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setLoadTestMode('concurrent')}
                    disabled={loadTestStatus === 'running'}
                    className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                      loadTestMode === 'concurrent'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="size-5" />
                      <div>
                        <div>Concurrent</div>
                        <div className="text-xs opacity-80">All at once (stress test)</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setLoadTestMode('sequential')}
                    disabled={loadTestStatus === 'running'}
                    className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                      loadTestMode === 'sequential'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Activity className="size-5" />
                      <div>
                        <div>Sequential</div>
                        <div className="text-xs opacity-80">One by one (gradual)</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              size="lg"
              onClick={runLoadTest}
              disabled={loadTestStatus === 'running'}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
            >
              {loadTestStatus === 'running' ? (
                <>
                  <Loader2 className="size-5 mr-2 animate-spin" />
                  Running Test... {loadTestProgress}%
                </>
              ) : (
                <>
                  <Zap className="size-5 mr-2" />
                  Start Load Test ({loadTestQuantity} bookings)
                </>
              )}
            </Button>
            
            {loadTestStatus !== 'idle' && (
              <Button
                size="lg"
                variant="outline"
                onClick={clearLoadTestResults}
                disabled={loadTestStatus === 'running'}
              >
                Clear Results
              </Button>
            )}
          </div>

          {/* Progress Bar */}
          {loadTestStatus === 'running' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">
                  Testing in progress...
                </span>
                <span className="font-mono font-semibold text-blue-600">
                  {loadTestResults.length} / {loadTestQuantity}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full"
                  style={{ width: `${loadTestProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Statistics Display */}
          {loadTestStatus === 'completed' && loadTestStats && (
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="size-6 text-green-600" />
                <h3 className="font-bold text-gray-900 text-lg">Load Test Results</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Total Requests */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="size-5 text-gray-500" />
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Total Requests</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{loadTestStats.total}</p>
                </div>

                {/* Success Rate */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="size-5 text-green-500" />
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Success</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {loadTestStats.success}
                    <span className="text-sm ml-1 text-gray-500">
                      ({Math.round((loadTestStats.success / loadTestStats.total) * 100)}%)
                    </span>
                  </p>
                </div>

                {/* Failed */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="size-5 text-red-500" />
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Failed</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    {loadTestStats.failed}
                    <span className="text-sm ml-1 text-gray-500">
                      ({Math.round((loadTestStats.failed / loadTestStats.total) * 100)}%)
                    </span>
                  </p>
                </div>

                {/* Avg Response Time */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="size-5 text-blue-500" />
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Avg Response</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {loadTestStats.avgResponseTime}<span className="text-sm ml-1">ms</span>
                  </p>
                </div>

                {/* Min Response */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="size-5 text-green-500" />
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Fastest</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {loadTestStats.minResponseTime}<span className="text-sm ml-1">ms</span>
                  </p>
                </div>

                {/* Max Response */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="size-5 text-amber-500" />
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Slowest</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-600">
                    {loadTestStats.maxResponseTime}<span className="text-sm ml-1">ms</span>
                  </p>
                </div>
              </div>

              {/* Success Rate Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Success Rate</span>
                  <span className="font-mono font-semibold text-green-600">
                    {Math.round((loadTestStats.success / loadTestStats.total) * 100)}%
                  </span>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    style={{ width: `${(loadTestStats.success / loadTestStats.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Test Results Log */}
          {loadTestResults.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Test Results Log</h3>
                <Badge variant="outline">{loadTestResults.length} entries</Badge>
              </div>
              
              <div className="max-h-64 overflow-y-auto bg-gray-50 rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold">#</th>
                      <th className="px-3 py-2 text-left font-semibold">Booking ID</th>
                      <th className="px-3 py-2 text-left font-semibold">Status</th>
                      <th className="px-3 py-2 text-left font-semibold">Time (ms)</th>
                      <th className="px-3 py-2 text-left font-semibold">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadTestResults.map((result, index) => (
                      <tr key={index} className="border-t border-gray-200 hover:bg-gray-100">
                        <td className="px-3 py-2 text-gray-500">#{index + 1}</td>
                        <td className="px-3 py-2 font-mono text-xs">{result.bookingId}</td>
                        <td className="px-3 py-2">
                          {result.status === 'success' ? (
                            <Badge className="bg-green-500">Success</Badge>
                          ) : (
                            <Badge variant="destructive">Failed</Badge>
                          )}
                        </td>
                        <td className="px-3 py-2 font-mono">{result.responseTime}</td>
                        <td className="px-3 py-2 text-xs text-red-600">{result.error || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Error State */}
          {loadTestStatus === 'error' && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 text-red-700">
                <XCircle className="size-5" />
                <span className="font-semibold">Load test failed</span>
              </div>
              <p className="text-sm text-red-600 mt-2">
                An error occurred during the load test. Please check your configuration and try again.
              </p>
            </div>
          )}

          {/* Warning Notice */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 mb-1">⚠️ Important Notice</p>
                <p className="text-sm text-amber-800">
                  Load testing will create <strong>real records</strong> in Airtable and send actual notifications via Telegram and Email. 
                  Use reasonable quantities to avoid overwhelming your external services.
                </p>
                <p className="text-sm text-amber-800 mt-2">
                  <strong>Recommended limits:</strong> Start with 5-10 for initial tests, max 100 for stress testing.
                </p>
                <p className="text-sm text-amber-800 mt-2">
                  <strong>⚡ Rate Limiting:</strong> Email notifications are automatically rate-limited to 4 requests/second (Resend API limit: 5/sec). 
                  The system includes retry mechanism with exponential backoff for reliability.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="font-medium">1. Check Environment Variables First</p>
            <p className="text-muted-foreground">Ensure all API keys and tokens are configured in Supabase Edge Functions secrets.</p>
          </div>
          <div>
            <p className="font-medium">2. Test Individual Services</p>
            <p className="text-muted-foreground">Test Airtable, Telegram, and Email separately to identify specific issues.</p>
          </div>
          <div>
            <p className="font-medium">3. Run Full Integration Test</p>
            <p className="text-muted-foreground">Once individual tests pass, run the full test to verify the complete workflow.</p>
          </div>
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="font-medium text-yellow-800">⚠️ Note:</p>
            <p className="text-yellow-700 text-xs mt-1">
              Full integration test will create real records in Airtable and send actual notifications. 
              Check your Airtable base, Telegram group, and email inbox for test data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}