"use client";

import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useOrganization } from "../../_hooks/getOrganization";

import { useCreateBusinessPayment } from "../_hooks/businessPayment";
import { validateUpiId } from "../_hooks/validateUpiId";
import { useCreateBusiness } from "./_hooks/createBusiness";

// PaymentDetails type for local state

export default function CreateBusinessPage() {
  const router = useRouter();
  const {
    data: orgData,
    isPending,
    isError,
    error: orgError,
  } = useOrganization();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [businessType, setBusinessType] = useState<"INDIVIDUAL" | "COMPANY">(
    "INDIVIDUAL",
  );
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState("");
  const [upiId, setUpiId] = useState("");
  const [error, setError] = useState("");

  const createBusinessMutation = useCreateBusiness();

  const createPaymentMutation = useCreateBusinessPayment();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (isError || !orgData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-destructive text-lg font-semibold">
          {orgError instanceof Error
            ? orgError.message
            : "No organization found."}
        </div>
      </div>
    );
  }
  const organization = orgData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Validate UPI ID if provided
    if (upiId.trim()) {
      const validation = validateUpiId(upiId);
      if (!validation.valid) {
        setError(validation.message || "Invalid UPI ID");
        return;
      }
    }
    // Validate business form (let the hook throw for errors)
    try {
      const business = await createBusinessMutation.mutateAsync({
        organizationId: organization.id,
        name,
        businessType,
        address: address || undefined,
        phone: phone || undefined,
        description: description || undefined,
        email: email || undefined,
        website: website || undefined,
      });
      // If UPI ID is provided, create payment info
      if (upiId.trim()) {
        await createPaymentMutation.mutateAsync({
          businessId: business.id,
          upiId,
        });
      }
      router.push(`/organization/${organization.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create business",
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 p-2 hover:bg-muted"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {organization.name}
        </Button>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Create Business
            </h1>
            <p className="text-muted-foreground">
              Add a new business under {organization.name}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {/* Business Details */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Business Details</CardTitle>
                <CardDescription>
                  Basic information about your business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Business Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ceramic Studio"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type *</Label>
                  <select
                    id="businessType"
                    value={businessType}
                    onChange={(e) =>
                      setBusinessType(
                        e.target.value as "INDIVIDUAL" | "COMPANY",
                      )
                    }
                    className="h-11 w-full border rounded px-3 text-base"
                  >
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="COMPANY">Company</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="123 Main St, City, Country"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="text"
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="business@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Handcrafted ceramic vases and pottery..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <div className="flex gap-3">
                    <Input
                      id="logo"
                      type="url"
                      placeholder="https://example.com/logo.png"
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                      className="h-11"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 px-4 bg-transparent"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {/* Logo Preview */}
                {logo && (
                  <div className="space-y-2">
                    <Label>Logo Preview</Label>
                    <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden border">
                      <img
                        src={logo || "/placeholder.svg"}
                        alt="Logo preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Payment Details (UPI only) */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  Configure UPI ID for receiving payments (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID (Optional)</Label>
                  <Input
                    id="upiId"
                    type="text"
                    placeholder="business@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="h-11"
                  />
                  {upiId && !validateUpiId(upiId).valid && (
                    <p className="text-sm text-destructive mt-1">
                      {validateUpiId(upiId).message}
                    </p>
                  )}
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> UPI ID can be added later. You can
                    start adding products without configuring payments.
                  </p>
                </div>
              </CardContent>
            </Card>
            {/* Submit Actions */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 h-11 border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createBusinessMutation.isPending || !name.trim()}
                className="flex-1 h-11 bg-slate-900 hover:bg-slate-800"
              >
                {createBusinessMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Business"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
