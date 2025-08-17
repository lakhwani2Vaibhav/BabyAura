
import { NextRequest, NextResponse } from "next/server";
import { updateHospitalStatus, findHospitalById } from "@/services/user-service";
import { findUserByEmail } from "@/services/user-service";
import * as brevo from '@getbrevo/brevo';
import { render } from '@react-email/render';
import { AccountStatusUpdateEmail } from "@/components/emails/AccountStatusUpdateEmail";

type RouteParams = {
    params: {
        hospitalId: string
    }
}

let apiInstance: brevo.TransactionalEmailsApi | null = null;
if (process.env.BREVO_API_KEY) {
  apiInstance = new brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
}

const checkSuperAdmin = async (req: NextRequest) => {
    // This is a placeholder for real auth check from token
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return false;
    // In a real app, you would decode the token and check the role
    return true; 
}


export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const isSuperAdmin = await checkSuperAdmin(req);
        if(!isSuperAdmin) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { hospitalId } = params;
        const hospitalDetails = await findHospitalById(hospitalId);

        if (!hospitalDetails) {
            return NextResponse.json({ message: "Hospital not found." }, { status: 404 });
        }
        
        return NextResponse.json(hospitalDetails);

    } catch (error) {
        console.error("Failed to fetch hospital details:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}


export async function PUT(req: NextRequest, { params }: RouteParams) {
    try {
        const isSuperAdmin = await checkSuperAdmin(req);
        if(!isSuperAdmin) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
        
        const { hospitalId } = params;
        const { status } = await req.json();

        if (!status) {
            return NextResponse.json({ message: "Status is required." }, { status: 400 });
        }

        const result = await updateHospitalStatus(hospitalId, status);
        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: "Hospital not found or status is already set." }, { status: 404 });
        }

        // Send notification email
        if (apiInstance) {
            const hospital = await findHospitalById(hospitalId);
            if (hospital) {
                const emailHtml = render(<AccountStatusUpdateEmail 
                    name={hospital.ownerName}
                    hospitalName={hospital.hospitalName}
                    status={status}
                    supportEmail="babyauraindia@gmail.com"
                />);

                const sendSmtpEmail = new brevo.SendSmtpEmail();
                sendSmtpEmail.sender = { name: 'BabyAura Platform Support', email: 'noreply@babyaura.in' };
                sendSmtpEmail.to = [{ email: hospital.email, name: hospital.ownerName }];
                sendSmtpEmail.subject = `Your BabyAura Account Status Update: ${hospital.hospitalName}`;
                sendSmtpEmail.htmlContent = emailHtml;

                try {
                    await apiInstance.sendTransacEmail(sendSmtpEmail);
                } catch(e) {
                    console.error("Failed to send status update email:", e);
                    // Don't fail the request if email sending fails, just log it.
                }
            }
        }


        return NextResponse.json({ message: "Hospital status updated successfully." });

    } catch (error) {
        console.error("Failed to update hospital status:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
