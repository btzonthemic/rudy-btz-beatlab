import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const AdminAnalytics = () => {
  const { data: analyticsSummary } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_analytics_summary');
      if (error) throw error;
      return data;
    }
  });

  const { data: revenueData } = useQuery({
    queryKey: ['revenue-data'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_revenue_data');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analyticsSummary?.map((metric: any) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month_str" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="revenue_amount" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};