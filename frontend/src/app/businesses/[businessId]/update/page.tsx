"use client";

import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { useGetBusiness } from "../../_hooks/getBusiness";
import { useUpdateBusiness } from "../../_hooks/updateBusiness";

export default function UpdateBusinessPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = params.businessId as string;
  const {
    data: business,
    isPending,
    isError,
    error,
  } = useGetBusiness(businessId);
  const updateBusinessMutation = useUpdateBusiness();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [_logo, _setLogo] = useState("");
  const [businessType, setBusinessType] = useState<"INDIVIDUAL" | "COMPANY">(
    "INDIVIDUAL",
  );
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (business) {
      setName(business.name || "");
      setDescription(business.description || "");
      // setLogo( business.logo || "" );
      setBusinessType(business.businessType || "INDIVIDUAL");
      setAddress(business.address || "");
      setPhone(business.phone || "");
      setEmail(business.email || "");
      setWebsite(business.website || "");
    }
  }, [business]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    try {
      await updateBusinessMutation.mutateAsync({
        businessId: businessId,
        name,
        description,
        // logo,
        businessType,
        address,
        phone,
        email,
        website,
      });
      router.push(`/organization`);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to update business",
      );
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (isError || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-destructive text-lg font-semibold">
          {error instanceof Error ? error.message : "Business not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-xl">
        <h1 className="text-2xl font-bold mb-4">Update Business</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {formError && (
            <Alert variant="destructive">
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
              <CardDescription>
                Update your business information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name *</Label>
                <Input
                  id="name"
                  type="text"
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
                    setBusinessType(e.target.value as "INDIVIDUAL" | "COMPANY")
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
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
              {/*<div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <div className="flex gap-3">
                  <Input
                    id="logo"
                    type="url"
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
              {logo && (
                <div className="space-y-2">
                  <Label>Logo Preview</Label>
                  <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden border">
                    <Image
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
               */}
            </CardContent>
          </Card>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateBusinessMutation.isPending}
              className="flex-1 bg-slate-900 hover:bg-slate-800"
            >
              {updateBusinessMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Business"
              )}
            </Button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
