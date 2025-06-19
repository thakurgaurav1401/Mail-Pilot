
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart, CheckCircle, TrendingUp, Users, Mail, Edit3, LayoutTemplate, Wand2 } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  description?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, description, color = "text-primary" }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);


export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome to MailPilot!</h1>
          <p className="text-muted-foreground">Your central hub for managing bulk email campaigns.</p>
        </div>
        <Link href="/compose">
          <Button size="lg">
            <Mail className="mr-2 h-5 w-5" />
            Compose New Email
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Recipients" value="1,234" icon={Users} description="+201 this month" color="text-blue-500" />
        <StatCard title="Emails Sent" value="5,678" icon={CheckCircle} description="Last campaign: 500" color="text-green-500" />
        <StatCard title="Open Rate" value="23.5%" icon={TrendingUp} description="Avg. for industry: 18%" color="text-yellow-500" />
        <StatCard title="Click Rate" value="4.2%" icon={BarChart} description="Target: 5%" color="text-purple-500" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Overview of your latest email campaigns.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for recent campaigns list */}
            <ul className="space-y-3">
              {['Summer Sale Blast', 'New Product Launch', 'Weekly Newsletter #12'].map((campaign, index) => (
                <li key={index} className="flex items-center justify-between rounded-md border p-3 shadow-sm">
                  <div>
                    <p className="font-medium">{campaign}</p>
                    <p className="text-sm text-muted-foreground">Sent: {new Date(Date.now() - index * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                  </div>
                  <Button variant="outline" size="sm">View Report</Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link href="/compose" passHref>
              <Button variant="outline" className="w-full justify-start p-6 text-left">
                <Edit3 className="mr-3 h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold">Compose Email</p>
                  <p className="text-xs text-muted-foreground">Draft a new email campaign.</p>
                </div>
              </Button>
            </Link>
            <Link href="/recipients" passHref>
               <Button variant="outline" className="w-full justify-start p-6 text-left">
                <Users className="mr-3 h-6 w-6 text-primary" />
                 <div>
                  <p className="font-semibold">Manage Recipients</p>
                  <p className="text-xs text-muted-foreground">Upload or view your contact lists.</p>
                </div>
              </Button>
            </Link>
            <Link href="/templates" passHref>
               <Button variant="outline" className="w-full justify-start p-6 text-left">
                <LayoutTemplate className="mr-3 h-6 w-6 text-primary" />
                 <div>
                  <p className="font-semibold">Use a Template</p>
                  <p className="text-xs text-muted-foreground">Start from a pre-designed template.</p>
                </div>
              </Button>
            </Link>
            <Link href="/optimizer" passHref>
              <Button variant="outline" className="w-full justify-start p-6 text-left">
                <Wand2 className="mr-3 h-6 w-6 text-primary" />
                 <div>
                  <p className="font-semibold">Optimize with AI</p>
                  <p className="text-xs text-muted-foreground">Improve your email content.</p>
                </div>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
