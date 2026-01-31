import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Belirli bir randevuyu getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'Randevu bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { success: false, error: 'Randevu alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// PATCH - Randevuyu güncelle
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, date, time, notes } = body;

    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { success: false, error: 'Randevu bulunamadı' },
        { status: 404 }
      );
    }

    const updateData: {
      status?: string;
      date?: Date;
      time?: string;
      notes?: string;
    } = {};
    
    if (status) updateData.status = status;
    if (date) updateData.date = new Date(date);
    if (time) updateData.time = time;
    if (notes !== undefined) updateData.notes = notes;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Randevu başarıyla güncellendi',
      appointment 
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { success: false, error: 'Randevu güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE - Randevuyu sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { success: false, error: 'Randevu bulunamadı' },
        { status: 404 }
      );
    }

    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Randevu başarıyla silindi' 
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { success: false, error: 'Randevu silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
