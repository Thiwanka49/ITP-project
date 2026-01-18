import { useState } from "react";
import { useEquipment } from "@/contexts/EquipmentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Trash2, Search, Package, Users, Filter, Download, Eye, Calendar, DollarSign, Tag, Info, Phone, Mail, MapPin, Pencil, FileText } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import equipmentCardio from "@/assets/equipment-cardio.jpg";

export default function ViewAll() {
  const { suppliers, equipment, deleteSupplier, deleteEquipment, updateSupplier, updateEquipment } = useEquipment();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<{ type: 'equipment' | 'supplier', data: any } | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [activeTab, setActiveTab] = useState("equipment");

  const filteredEquipment = equipment.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'available': return 'default';
      case 'maintenance': return 'secondary';
      case 'out-of-stock': return 'destructive';
      default: return 'outline';
    }
  };

  const getSupplierName = (supplierId: string) => {
    return suppliers.find(s => s.id === supplierId)?.name || 'Unknown';
  };

  const handleDeleteEquipment = async (id: string, name: string) => {
    await deleteEquipment(id);
  };

  const handleDeleteSupplier = async (id: string, name: string) => {
    await deleteSupplier(id);
  };

  const handleUpdateSubmit = async () => {
    if (!selectedItem) return;

    try {
      if (selectedItem.type === 'equipment') {
        await updateEquipment(selectedItem.data.id, editFormData);
      } else {
        await updateSupplier(selectedItem.data.id, editFormData);
      }
      setIsEditOpen(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleExportPDF = (type: 'equipment' | 'suppliers') => {
    try {
      console.log(`Starting ${type} PDF generation...`);
      const data = type === 'equipment' ? equipment : suppliers;
      if (data.length === 0) {
        toast.error("No data to export");
        return;
      }

      const doc = new jsPDF();
      const tableColumn = type === 'equipment'
        ? ['Name', 'Category', 'Supplier', 'Qty', 'Price', 'Status']
        : ['Company Name', 'Email', 'Phone', 'Address'];

      const tableRows: any[] = [];

      data.forEach(item => {
        if (type === 'equipment') {
          const e = item as any;
          tableRows.push([
            e.name,
            e.category,
            getSupplierName(e.supplierId),
            e.quantity,
            `Rs. ${e.price.toLocaleString()}`,
            e.status
          ]);
        } else {
          const s = item as any;
          tableRows.push([s.name, s.email, s.phone, s.address]);
        }
      });

      // Add Title
      doc.setFontSize(20);
      doc.setTextColor(40);
      doc.text(`Fitplex Gym - ${type === 'equipment' ? 'Equipment Inventory' : 'Suppliers List'}`, 14, 22);

      // Add Date
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      console.log("Adding table to PDF...");
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { top: 35 },
      });

      console.log("Generating Blob and triggering download...");
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `fitplex_${type}_report_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report exported as PDF`);
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast.error("Failed to export PDF. Check console for details.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Image Banner */}
      <div className="relative h-40 rounded-xl overflow-hidden shadow-md">
        <img
          src={equipmentCardio}
          alt="Cardio equipment"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center p-6">
          <h1 className="text-3xl font-bold text-background">Inventory Management</h1>
          <p className="text-background/80 mt-1">View and manage all your equipment and suppliers</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search equipment or suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background border-input h-11"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => handleExportPDF(activeTab as 'equipment' | 'suppliers')}
          >
            <FileText className="h-4 w-4" />
            PDF Report
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-card-foreground">{equipment.length}</p>
          <p className="text-sm text-muted-foreground">Total Equipment</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-card-foreground">{suppliers.length}</p>
          <p className="text-sm text-muted-foreground">Total Suppliers</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{equipment.filter(e => e.status === 'available').length}</p>
          <p className="text-sm text-muted-foreground">Available</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-destructive">{equipment.filter(e => e.status === 'out-of-stock').length}</p>
          <p className="text-sm text-muted-foreground">Out of Stock</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-card border border-border p-1">
          <TabsTrigger value="equipment" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Package className="h-4 w-4" />
            Equipment ({filteredEquipment.length})
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="h-4 w-4" />
            Suppliers ({filteredSuppliers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="equipment">
          <Card className="bg-card border-border shadow-md">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-border">
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Equipment Inventory
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border bg-muted/30">
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">Supplier</TableHead>
                      <TableHead className="text-right font-semibold">Qty</TableHead>
                      <TableHead className="text-right font-semibold">Price</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEquipment.map((item) => (
                      <TableRow key={item.id} className="border-border hover:bg-accent/30 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Package className="h-4 w-4 text-primary" />
                            </div>
                            <span className="font-medium text-foreground">{item.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.category}</TableCell>
                        <TableCell className="text-muted-foreground">{getSupplierName(item.supplierId)}</TableCell>
                        <TableCell className="text-right font-medium text-foreground">{item.quantity}</TableCell>
                        <TableCell className="text-right font-semibold text-foreground">Rs {item.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(item.status)} className="capitalize">
                            {item.status.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                              onClick={() => {
                                setSelectedItem({ type: 'equipment', data: item });
                                setEditFormData({ ...item });
                                setIsEditOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-foreground"
                              onClick={() => {
                                setSelectedItem({ type: 'equipment', data: item });
                                setIsViewOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to remove ${item.name} from inventory?`)) {
                                  handleDeleteEquipment(item.id, item.name);
                                }
                              }}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredEquipment.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No equipment found</p>
                  <p className="text-sm text-muted-foreground/70">Try adjusting your search terms</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers">
          <Card className="bg-card border-border shadow-md">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-border">
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Registered Suppliers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border bg-muted/30">
                      <TableHead className="font-semibold">Company Name</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Phone</TableHead>
                      <TableHead className="font-semibold">Address</TableHead>
                      <TableHead className="text-center font-semibold">Equipment</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSuppliers.map((supplier) => {
                      const supplierEquipment = equipment.filter(e => e.supplierId === supplier.id);
                      const totalUnits = supplierEquipment.reduce((sum, e) => sum + e.quantity, 0);

                      return (
                        <TableRow key={supplier.id} className="border-border hover:bg-accent/30 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-semibold text-sm">
                                {supplier.name.charAt(0)}
                              </div>
                              <span className="font-medium text-foreground">{supplier.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{supplier.email}</TableCell>
                          <TableCell className="text-muted-foreground">{supplier.phone}</TableCell>
                          <TableCell className="text-muted-foreground max-w-[200px] truncate">{supplier.address}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="font-medium">
                              {totalUnits} units
                              <span className="text-[10px] opacity-70 ml-1">({supplierEquipment.length} types)</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                                onClick={() => {
                                  setSelectedItem({ type: 'supplier', data: supplier });
                                  setEditFormData({ ...supplier });
                                  setIsEditOpen(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-foreground"
                                onClick={() => {
                                  setSelectedItem({ type: 'supplier', data: supplier });
                                  setIsViewOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete ${supplier.name}? All associated inventory items will also be removed.`)) {
                                    handleDeleteSupplier(supplier.id, supplier.name);
                                  }
                                }}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              {filteredSuppliers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No suppliers found</p>
                  <p className="text-sm text-muted-foreground/70">Try adjusting your search terms</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[500px] border-none bg-card/95 backdrop-blur-md shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/20" />

          <DialogHeader className="pt-6">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              {selectedItem?.type === 'equipment' ? (
                <><Package className="h-6 w-6 text-primary" /> Equipment Details</>
              ) : (
                <><Users className="h-6 w-6 text-primary" /> Supplier Information</>
              )}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-base">
              Detailed overview of {selectedItem?.type === 'equipment' ? 'inventory item' : 'business partner'}
            </DialogDescription>
          </DialogHeader>

          {selectedItem?.type === 'equipment' && (
            <div className="space-y-6 mt-4">
              <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border/50">
                <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedItem.data.name}</h3>
                  <Badge variant={getStatusVariant(selectedItem.data.status)} className="mt-1 capitalize">
                    {selectedItem.data.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/20 p-4 rounded-xl border border-border/30">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Tag className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Category</span>
                  </div>
                  <p className="font-semibold text-foreground">{selectedItem.data.category}</p>
                </div>
                <div className="bg-muted/20 p-4 rounded-xl border border-border/30">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Info className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Quantity</span>
                  </div>
                  <p className="font-semibold text-foreground text-lg">{selectedItem.data.quantity} Units</p>
                </div>
                <div className="bg-muted/20 p-4 rounded-xl border border-border/30">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Unit Price</span>
                  </div>
                  <p className="font-semibold text-foreground text-lg">Rs. {selectedItem.data.price?.toLocaleString()}</p>
                </div>
                <div className="bg-muted/20 p-4 rounded-xl border border-border/30">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Purchase Date</span>
                  </div>
                  <p className="font-semibold text-foreground italic">
                    {new Date(selectedItem.data.purchaseDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 space-y-2">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <Users className="h-4 w-4" />
                  <span>Supplier Details</span>
                </div>
                <p className="text-foreground pl-6 font-medium">
                  {getSupplierName(selectedItem.data.supplierId)}
                </p>
              </div>
            </div>
          )}

          {selectedItem?.type === 'supplier' && (
            <div className="space-y-6 mt-4">
              <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border/50">
                <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 text-2xl font-bold text-secondary-foreground">
                  {selectedItem.data.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedItem.data.name}</h3>
                  <p className="text-muted-foreground text-sm italic">Registered Partner</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/20 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Email Address</p>
                    <p className="text-foreground font-medium">{selectedItem.data.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/20 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Phone Number</p>
                    <p className="text-foreground font-medium">{selectedItem.data.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/20 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Headquarters</p>
                    <p className="text-foreground font-medium">{selectedItem.data.address}</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex justify-between items-center">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <Package className="h-4 w-4 text-primary" />
                  <span>Total Inventory Types</span>
                </div>
                <Badge variant="secondary" className="px-3 py-1 font-bold">
                  {equipment.filter(e => e.supplierId === selectedItem.data.id).length} Items
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit View Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px] border-none bg-card shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Pencil className="h-6 w-6 text-primary" />
              Edit {selectedItem?.type === 'equipment' ? 'Equipment' : 'Supplier'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {selectedItem?.type === 'equipment' ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="name">Equipment Name</Label>
                  <Input
                    id="name"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={editFormData.category}
                      onValueChange={(val) => setEditFormData({ ...editFormData, category: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="Free Weights">Free Weights</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={editFormData.status}
                      onValueChange={(val) => setEditFormData({ ...editFormData, status: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={editFormData.quantity || 0}
                      onChange={(e) => setEditFormData({ ...editFormData, quantity: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Unit Price (Rs.)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={editFormData.price || 0}
                      onChange={(e) => setEditFormData({ ...editFormData, price: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="sname">Company Name</Label>
                  <Input
                    id="sname"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editFormData.email || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editFormData.phone || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={editFormData.address || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
