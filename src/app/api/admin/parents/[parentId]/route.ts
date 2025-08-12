
import { NextRequest, NextResponse } from "next/server";
import { deleteParent } from "@/services/user-service";

type RouteParams = {
    params: {
        parentId: string
    }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
     try {
        const { parentId } = params;
        
        // Add security here: check if the admin making the request has permission for this parent's hospital.
        
        const result = await deleteParent(parentId);

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "Parent not found." }, { status: 404 });
        }
        
        return NextResponse.json({ message: "Parent deleted successfully." });

    } catch (error) {
        console.error("Failed to delete parent:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
