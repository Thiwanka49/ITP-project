import { useEquipment } from "@/contexts/EquipmentContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area } from "recharts";
import { TrendingUp, Package, DollarSign, PieChart as PieChartIcon, Activity, Download, Calendar, ArrowUpRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import gymHero from "@/assets/gym-hero.jpg";

export default function Reports() {
  const { suppliers, equipment } = useEquipment();

  // Category distribution data
  const categoryData = equipment.reduce((acc, item) => {
    const existing = acc.find(c => c.name === item.category);
    if (existing) {
      existing.count += 1;
      existing.value += item.price * item.quantity;
    } else {
      acc.push({ name: item.category, count: 1, value: item.price * item.quantity });
    }
    return acc;
  }, [] as { name: string; count: number; value: number }[]);

  // Status distribution
  const statusData = [
    { name: 'Available', value: equipment.filter(e => e.status === 'available').length, color: 'hsl(var(--chart-1))' },
    { name: 'Maintenance', value: equipment.filter(e => e.status === 'maintenance').length, color: 'hsl(var(--chart-2))' },
    { name: 'Out of Stock', value: equipment.filter(e => e.status === 'out-of-stock').length, color: 'hsl(var(--chart-3))' },
  ];

  // Supplier equipment count
  const supplierData = suppliers.map(s => ({
    name: s.name.split(' ')[0],
    equipment: equipment.filter(e => e.supplierId === s.id).length,
    value: equipment.filter(e => e.supplierId === s.id).reduce((sum, e) => sum + e.price * e.quantity, 0),
  }));

  // Monthly trend data (mock)
  const monthlyData = [
    { month: 'Jan', purchases: 12000, maintenance: 2500 },
    { month: 'Feb', purchases: 15000, maintenance: 1800 },
    { month: 'Mar', purchases: 8500, maintenance: 3200 },
    { month: 'Apr', purchases: 22000, maintenance: 1500 },
    { month: 'May', purchases: 18000, maintenance: 2100 },
    { month: 'Jun', purchases: 25000, maintenance: 1900 },
  ];

  const totalInventoryValue = equipment.reduce((sum, e) => sum + e.price * e.quantity, 0);
  const avgEquipmentPrice = equipment.length > 0 ? totalInventoryValue / equipment.reduce((sum, e) => sum + e.quantity, 0) : 0;

  const handleExportPDF = () => {
    try {
      console.log("Starting PDF generation...");
      const doc = new jsPDF();

      // Add Title
      doc.setFontSize(22);
      doc.setTextColor(40, 40, 40);
      doc.text("Fitplex Gym - Analytics Report", 14, 22);

      // Add Generation Date
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 14, 30);

      // Key Metrics Section
      doc.setFontSize(14);
      doc.setTextColor(59, 130, 246); // Primary color
      doc.text("Executive Summary", 14, 45);

      const summaryData = [
        ["Total Inventory Value", `Rs. ${totalInventoryValue.toLocaleString()}`],
        ["Average Equipment Price", `Rs. ${avgEquipmentPrice.toFixed(2)}`],
        ["Total Categories", categoryData.length.toString()],
        ["Available Equipment", equipment.filter(e => e.status === 'available').length.toString()],
        ["Maintenance Required", equipment.filter(e => e.status === 'maintenance').length.toString()],
        ["Out of Stock", equipment.filter(e => e.status === 'out-of-stock').length.toString()],
      ];

      console.log("Adding summary table...");
      autoTable(doc, {
        body: summaryData,
        startY: 50,
        theme: 'plain',
        styles: { fontSize: 11, cellPadding: 3 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } },
      });

      // Category Breakdown Section
      const lastTable = (doc as any).lastAutoTable;
      if (!lastTable) {
        throw new Error("Failed to get lastAutoTable from doc");
      }
      const finalY = lastTable.finalY + 15;

      console.log("Adding category breakdown table at Y:", finalY);
      doc.setFontSize(14);
      doc.setTextColor(59, 130, 246);
      doc.text("Catalog Distribution", 14, finalY);

      const categoryRows = categoryData.map(c => [
        c.name,
        c.count,
        `Rs ${c.value.toLocaleString()}`
      ]);

      console.log("Generating Blob and triggering download...");
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `fitplex_analytics_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Analytics report downloaded as PDF");
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast.error("Failed to generate PDF. Check console for details.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Image */}
      <div className="relative h-48 rounded-xl overflow-hidden shadow-md">
        <img
          src={gymHero}
          alt="Gym equipment"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-between p-6">
          <div>
            <h1 className="text-3xl font-bold text-background">Analytics & Reports</h1>
            <p className="text-background/80 mt-1">Insights and data visualization for your gym equipment</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="gap-2 bg-background/20 backdrop-blur text-background border-background/30 hover:bg-background/30">
              <Calendar className="h-4 w-4" />
              This Month
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="gap-2 bg-background/20 backdrop-blur text-background border-background/30 hover:bg-background/30"
              onClick={handleExportPDF}
            >
              <FileText className="h-4 w-4" />
              PDF Report
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
            <div className="relative flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Inventory Value</p>
                <p className="text-3xl font-bold text-card-foreground">Rs. {totalInventoryValue.toLocaleString()}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3" />
                  +12% from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
            <div className="relative flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Avg Equipment Price</p>
                <p className="text-3xl font-bold text-card-foreground">Rs. {avgEquipmentPrice.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground mt-1">Per unit average</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
            <div className="relative flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Categories</p>
                <p className="text-3xl font-bold text-card-foreground">{categoryData.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Equipment types</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border shadow-md">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-card-foreground">Monthly Spending Trends</CardTitle>
                <CardDescription>Purchases vs Maintenance costs</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMaintenance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    color: 'hsl(var(--card-foreground))',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="purchases" stroke="hsl(var(--chart-1))" strokeWidth={2} fillOpacity={1} fill="url(#colorPurchases)" name="Purchases" />
                <Area type="monotone" dataKey="maintenance" stroke="hsl(var(--chart-3))" strokeWidth={2} fillOpacity={1} fill="url(#colorMaintenance)" name="Maintenance" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-md">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <PieChartIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-card-foreground">Equipment Status</CardTitle>
                <CardDescription>Distribution by availability</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    color: 'hsl(var(--card-foreground))',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-md">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-card-foreground">Equipment by Category</CardTitle>
                <CardDescription>Count per category type</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    color: 'hsl(var(--card-foreground))',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--chart-1))" name="Count" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-md">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-card-foreground">Supplier Performance</CardTitle>
                <CardDescription>Inventory value by supplier</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={supplierData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    color: 'hsl(var(--card-foreground))',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number) => [`Rs ${value.toLocaleString()}`, 'Inventory Value']}
                />
                <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
