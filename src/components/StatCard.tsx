import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  trend?: { value: number; isPositive: boolean };
}

export function StatCard({ title, value, icon, subtitle, trend }: StatCardProps) {
  return (
    <Card className="bg-card border-border shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      <CardContent className="p-6 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300" />
        <div className="relative flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-3xl font-bold text-card-foreground">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className={`flex items-center gap-1 text-sm mt-2 ${trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                {trend.isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="font-medium">{Math.abs(trend.value)}%</span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            )}
          </div>
          <div className="p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-300">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
