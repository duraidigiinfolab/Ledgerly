"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, User, Building2 } from "lucide-react";
import type { ClientData } from "@/components/invoice-editor";

interface ClientSelectorProps {
  clients: ClientData[];
  selectedClient: ClientData | null;
  onSelect: (client: ClientData | null) => void;
  onClientCreated: (client: ClientData) => void;
}

export function ClientSelector({
  clients,
  selectedClient,
  onSelect,
  onClientCreated,
}: ClientSelectorProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreateClient = async () => {
    if (!newName.trim()) return;
    setCreating(true);

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail || undefined,
          address: newAddress || undefined,
          phone: newPhone || undefined,
        }),
      });

      if (res.ok) {
        const client = await res.json();
        onClientCreated(client);
        setDialogOpen(false);
        setNewName("");
        setNewEmail("");
        setNewAddress("");
        setNewPhone("");
      }
    } catch (error) {
      console.error("Create client error:", error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <Select
            value={selectedClient?.id || ""}
            onValueChange={(value) => {
              const client = clients.find((c) => c.id === value);
              onSelect(client || null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  <span className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    {client.name}
                  </span>
                </SelectItem>
              ))}
              {clients.length === 0 && (
                <div className="px-2 py-4 text-center text-sm text-slate-400">
                  No clients yet
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Create a new client to use in your invoices.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label htmlFor="client-name">Name *</Label>
                <Input
                  id="client-name"
                  placeholder="Client or company name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="client-email">Email</Label>
                <Input
                  id="client-email"
                  type="email"
                  placeholder="client@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="client-phone">Phone</Label>
                <Input
                  id="client-phone"
                  placeholder="+1 (555) 000-0000"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="client-address">Address</Label>
                <Textarea
                  id="client-address"
                  placeholder="Full address"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="mt-1.5"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateClient}
                disabled={!newName.trim() || creating}
              >
                {creating ? "Creating..." : "Create Client"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Selected client preview */}
      {selectedClient && (
        <div className="rounded-lg bg-slate-50 p-3 text-sm">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-indigo-500" />
            <span className="font-medium text-slate-900">
              {selectedClient.name}
            </span>
          </div>
          {selectedClient.email && (
            <p className="text-slate-500 ml-6">{selectedClient.email}</p>
          )}
          {selectedClient.address && (
            <p className="text-slate-500 ml-6">{selectedClient.address}</p>
          )}
        </div>
      )}
    </div>
  );
}
