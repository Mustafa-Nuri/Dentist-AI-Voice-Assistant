import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Tüm randevuları getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');

    const where: { status?: string; date?: { gte: Date; lt: Date } } = {};
    
    if (status) {
      where.status = status;
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      where.date = { gte: startDate, lt: endDate };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({ success: true, appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { success: false, error: 'Randevular alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// POST - Yeni randevu oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, doctor, service, date, time, notes } = body;

    // Validasyon
    if (!name || !phone || !doctor || !service || !date || !time) {
      return NextResponse.json(
        { success: false, error: 'Lütfen tüm zorunlu alanları doldurun' },
        { status: 400 }
      );
    }

    // Aynı doktor için aynı tarih ve saatte randevu var mı kontrol et
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctor,
        date: new Date(date),
        time,
        status: { not: 'cancelled' },
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { success: false, error: 'Bu tarih ve saatte seçilen doktorun randevusu dolu' },
        { status: 409 }
      );
    }

    // Yeni randevu oluştur
    const appointment = await prisma.appointment.create({
      data: {
        name,
        phone,
        email: email || null,
        doctor,
        service,
        date: new Date(date),
        time,
        notes: notes || null,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Randevunuz başarıyla oluşturuldu!',
      appointment 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { success: false, error: 'Randevu oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}
