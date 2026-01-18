import { Package, Users, DollarSign, AlertTriangle, Dumbbell, ArrowRight, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { useEquipment } from "@/contexts/EquipmentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import gymHero from "@/assets/gym-hero.jpg";

export default function Home() {
  const { suppliers, equipment } = useEquipment();

  const totalValue = equipment.reduce((sum, e) => sum + e.price * e.quantity, 0);
  const maintenanceCount = equipment.filter(e => e.status === 'maintenance').length;
  const outOfStockCount = equipment.filter(e => e.status === 'out-of-stock').length;
  const totalQuantity = equipment.reduce((sum, e) => sum + e.quantity, 0);

  const recentEquipment = [...equipment]
    .sort((a, b) => b.purchaseDate.getTime() - a.purchaseDate.getTime())
    .slice(0, 5);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'available': return 'default';
      case 'maintenance': return 'secondary';
      case 'out-of-stock': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={gymHero}
          alt="Modern gym interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center p-8">
          <h1 className="text-4xl font-bold text-background mb-2">Welcome Back!</h1>
          <p className="text-background/80 text-lg max-w-md">
            Manage your gym equipment inventory with ease. Track suppliers, monitor equipment status, and generate reports.
          </p>
          <div className="flex gap-3 mt-4">
            <Button asChild className="shadow-md">
              <Link to="/add-supplier">
                Add Supplier
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-background/20 border-background/30 text-background hover:bg-background/30">
              <Link to="/view-all">View Inventory</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Equipment"
          value={equipment.length}
          subtitle={`${totalQuantity} total items`}
          icon={<Package className="h-6 w-6 text-primary" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Suppliers"
          value={suppliers.length}
          subtitle="Active partners"
          icon={<Users className="h-6 w-6 text-primary" />}
        />
        <StatCard
          title="Inventory Value"
          value={`Rs. ${totalValue.toLocaleString()}`}
          subtitle="Total investment"
          icon={<DollarSign className="h-6 w-6 text-primary" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Needs Attention"
          value={maintenanceCount + outOfStockCount}
          subtitle={`${maintenanceCount} maintenance, ${outOfStockCount} out of stock`}
          icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                Recent Equipment
              </CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-primary">
                <Link to="/view-all">View All <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentEquipment.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 hover:bg-accent/30 transition-colors"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">Rs {item.price.toLocaleString()}</span>
                    <Badge variant={getStatusVariant(item.status)} className="capitalize">
                      {item.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                Top Suppliers
              </CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-primary">
                <Link to="/view-all">View All <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {suppliers.map((supplier, index) => {
                const supplierEquipment = equipment.filter(e => e.supplierId === supplier.id);
                const supplierValue = supplierEquipment.reduce((sum, e) => sum + e.price * e.quantity, 0);
                return (
                  <div
                    key={supplier.id}
                    className="flex items-center justify-between p-4 hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-semibold">
                        {supplier.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{supplier.name}</p>
                        <p className="text-sm text-muted-foreground">{supplier.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">
                        {supplierEquipment.length} items
                      </Badge>
                      <p className="text-xs text-muted-foreground">Rs {supplierValue.toLocaleString()} value</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Bar */}
      <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8" />
              <div>
                <p className="text-sm opacity-80">This Month</p>
                <p className="text-2xl font-bold">+15% Growth</p>
              </div>
            </div>
            <div className="h-12 w-px bg-primary-foreground/20 hidden md:block" />
            <div className="text-center">
              <p className="text-3xl font-bold">{equipment.filter(e => e.status === 'available').length}</p>
              <p className="text-sm opacity-80">Available Equipment</p>
            </div>
            <div className="h-12 w-px bg-primary-foreground/20 hidden md:block" />
            <div className="text-center">
              <p className="text-3xl font-bold">{suppliers.length}</p>
              <p className="text-sm opacity-80">Active Suppliers</p>
            </div>
            <div className="h-12 w-px bg-primary-foreground/20 hidden md:block" />
            <Button variant="secondary" asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link to="/reports">
                View Reports
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
