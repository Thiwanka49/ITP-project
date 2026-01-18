import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEquipment } from "@/contexts/EquipmentContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus, Building2, Mail, Phone, MapPin, Sparkles, Package, Dumbbell, DollarSign, ListChecks } from "lucide-react";
import equipmentImg from "@/assets/equipment-weights.jpg";

export default function AddSupplier() {
  const { addSupplier, addEquipment, suppliers } = useEquipment();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    // Equipment Fields
    equipmentName: "",
    category: "",
    quantity: "1",
    price: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required supplier fields");
      return;
    }

    if (!formData.equipmentName || !formData.category || !formData.price) {
      toast.error("Please fill in the equipment details");
      return;
    }

    try {
      const supplier = await addSupplier({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      });
      const supplierId = supplier._id || supplier.id;

      await addEquipment({
        name: formData.equipmentName,
        category: formData.category,
        supplierId: supplierId,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        status: 'available',
        purchaseDate: new Date(),
      });

      navigate("/view-all");
    } catch (error) {
      console.error("Failed to process registration:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary rounded-xl shadow-md">
          <UserPlus className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Supplier Registration</h1>
          <p className="text-muted-foreground mt-1">Register a supplier and their initial equipment delivery</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form Container */}
        <div className="lg:col-span-3 space-y-6">
          {/* Supplier Section */}
          <Card className="bg-card border-border shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-card-foreground">Supplier Information</CardTitle>
                  <CardDescription>Company contact details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  Company Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter company name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-background border-input h-11"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="supplier@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-background border-input h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+1 555-0100"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-background border-input h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Business Address
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Enter full business address"
                  value={formData.address}
                  onChange={handleChange}
                  className="bg-background border-input min-h-[80px] resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Initial Equipment Section */}
          <Card className="bg-card border-border shadow-lg">
            <CardHeader className="bg-gradient-to-r from-secondary/10 to-transparent border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary/10 rounded-xl">
                  <Package className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-card-foreground">Initial Equipment</CardTitle>
                  <CardDescription>Equipment provided by this supplier</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="equipmentName" className="flex items-center gap-2">
                  <Dumbbell className="h-4 w-4 text-muted-foreground" />
                  Equipment Name *
                </Label>
                <Input
                  id="equipmentName"
                  name="equipmentName"
                  placeholder="e.g. Pro Treadmill v2"
                  value={formData.equipmentName}
                  onChange={handleChange}
                  className="bg-background border-input h-11"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-muted-foreground" />
                    Category *
                  </Label>
                  <Select onValueChange={(val) => handleSelectChange('category', val)} value={formData.category}>
                    <SelectTrigger className="h-11 bg-background border-input">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardio">Cardio</SelectItem>
                      <SelectItem value="Strength">Strength</SelectItem>
                      <SelectItem value="Free Weights">Free Weights</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    Quantity *
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="bg-background border-input h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Unit Price (Rs.) *
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  className="bg-background border-input h-11"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1 h-12 shadow-md">
              <Sparkles className="h-4 w-4 mr-2" />
              Register Supplier & Equipment
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/view-all")} className="h-12">
              Cancel
            </Button>
          </div>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-card border-border shadow-lg overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img
                src={equipmentImg}
                alt="Gym equipment"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" />
                Quick Intake
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Registering a supplier now requires adding their first equipment delivery. This keeps your inventory and supplier records perfectly synchronized from day one.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg">
            <CardContent className="p-5">
              <h3 className="mb-2 flex items-center gap-2 text-primary-foreground/90">
                <Sparkles className="h-4 w-4" />
                <span className="font-extrabold">Fitplex</span> Gym Process
              </h3>
              <p className="text-sm opacity-90 leading-relaxed">
                Once submitted, both the supplier and the equipment will be visible in the inventory management system.
              </p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
