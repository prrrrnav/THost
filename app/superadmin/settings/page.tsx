// app/superadmin/settings/page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChangePasswordModal } from "@/components/change-password-modal"
import { Mail, MessageSquare, User, Shield } from "lucide-react"

export default async function SuperAdminSettings() {
    return (
        <div className="flex flex-col gap-8 pb-10">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Settings</h1>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="bg-zinc-900 border-white/10">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="templates">Communication Templates</TabsTrigger>
                </TabsList>

                {/* Section 6: Profile Management */}
                <TabsContent value="profile" className="space-y-6">
                    <Card className="bg-zinc-950 border-white/10 shadow-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-zinc-100">
                                <User className="h-5 w-5 text-amber-400" /> Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Full Name</Label>
                                    <Input defaultValue="Super Admin" className="bg-white/5 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Email Address</Label>
                                    <Input defaultValue="admin@thost.com" className="bg-white/5 border-white/10" disabled />
                                </div>
                            </div>
                            <Button className="bg-amber-600 hover:bg-amber-700">Update Profile</Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-950 border-white/10 shadow-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-zinc-100">
                                <Shield className="h-5 w-5 text-amber-400" /> Security
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChangePasswordModal />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Section 5: Custom SMS/Email Templates */}
                <TabsContent value="templates" className="space-y-6">
                    <Card className="bg-zinc-950 border-white/10 shadow-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-zinc-100">
                                <Mail className="h-5 w-5 text-amber-400" /> Email Templates
                            </CardTitle>
                            <CardDescription className="text-zinc-500">
                                Use {"{{joining_code}}"} to insert the specific PG code into the message.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-zinc-400">Owner Welcome Email</Label>
                                <Textarea 
                                    className="min-h-[150px] bg-white/5 border-white/10" 
                                    defaultValue="Hello {{name}}, welcome to THost. Your PG joining code is {{joining_code}}."
                                />
                            </div>
                            <Button className="bg-amber-600 hover:bg-amber-700">Save Template</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}