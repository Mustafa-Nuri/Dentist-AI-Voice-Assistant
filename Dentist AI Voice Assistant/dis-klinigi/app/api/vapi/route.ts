import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Bu endpoint Vapi AI asistanı tarafından kullanılacak
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Vapi Request:', JSON.stringify(body, null, 2));
    
    const { message } = body;
    
    // Vapi tool-calls formatı (yeni format)
    if (message?.type === 'tool-calls') {
      const toolCalls = message.toolCalls || [];
      const results = [];
      
      for (const toolCall of toolCalls) {
        if (toolCall.function?.name === 'book_appointment') {
          const params = toolCall.function.arguments || {};
          const result = await createAppointmentInternal(params);
          results.push({
            toolCallId: toolCall.id,
            result: JSON.stringify(result)
          });
        } else if (toolCall.function?.name === 'get_available_times') {
          const params = toolCall.function.arguments || {};
          const result = await getAvailableTimes(params.doctor, params.date);
          results.push({
            toolCallId: toolCall.id,
            result: JSON.stringify(result)
          });
        } else if (toolCall.function?.name === 'get_doctors') {
          results.push({
            toolCallId: toolCall.id,
            result: JSON.stringify({
              doctors: [
                { name: 'Dr. Can Yılmaz', specialty: 'Pedodonti (Çocuk Diş Hekimliği)' },
                { name: 'Dr. Elif Demir', specialty: 'Ortodonti (Tel Tedavisi)' },
                { name: 'Dr. Mehmet Öz', specialty: 'Çene Cerrahisi' },
              ]
            })
          });
        } else if (toolCall.function?.name === 'get_services') {
          results.push({
            toolCallId: toolCall.id,
            result: JSON.stringify({
              services: ['İmplant', 'Diş Beyazlatma', 'Kanal Tedavisi', 'Zirkonyum Kaplama', 'Genel Kontrol', 'Diş Çekimi', 'Dolgu', 'Diş Temizliği']
            })
          });
        }
      }
      
      return NextResponse.json({ results });
    }
    
    // Eski format desteği
    const { functionCall, name, phone, doctor, service, date, time, email, notes } = body;

    if (functionCall && functionCall.name === 'book_appointment') {
      const params = functionCall.parameters || {};
      const result = await createAppointmentInternal(params);
      return NextResponse.json(result);
    }

    if (name && phone && doctor && service && date && time) {
      const result = await createAppointmentInternal({ name, phone, doctor, service, date, time, email, notes });
      return NextResponse.json(result);
    }

    return NextResponse.json({
      success: true,
      message: 'Diş kliniği randevu sistemi hazır.',
      doctors: ['Dr. Can Yılmaz', 'Dr. Elif Demir', 'Dr. Mehmet Öz'],
      services: ['İmplant', 'Diş Beyazlatma', 'Kanal Tedavisi', 'Zirkonyum', 'Genel Kontrol'],
    });
    
  } catch (error) {
    console.error('Vapi endpoint error:', error);
    return NextResponse.json(
      { success: false, error: 'Randevu işlenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

async function getAvailableTimes(doctor: string, date: string) {
  try {
    const appointmentDate = new Date(date);
    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        doctor,
        date: appointmentDate,
        status: { not: 'cancelled' },
      },
      select: { time: true }
    });

    const allTimes = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];
    const bookedTimes = bookedAppointments.map(a => a.time);
    const availableTimes = allTimes.filter(t => !bookedTimes.includes(t));

    return {
      success: true,
      doctor,
      date,
      availableTimes,
      message: availableTimes.length > 0 
        ? `${doctor} için müsait saatler: ${availableTimes.join(', ')}`
        : `${doctor} için bu tarihte müsait saat yok.`
    };
  } catch {
    return { success: false, error: 'Müsait saatler alınırken hata oluştu' };
  }
}

async function createAppointmentInternal(params: {
  name?: string;
  phone?: string;
  doctor?: string;
  service?: string;
  date?: string;
  time?: string;
  email?: string;
  notes?: string;
}) {
  const { name, phone, doctor, service, date, time, email, notes } = params;

  if (!name || !phone || !doctor || !service || !date || !time) {
    const missing = [];
    if (!name) missing.push('ad-soyad');
    if (!phone) missing.push('telefon');
    if (!doctor) missing.push('doktor');
    if (!service) missing.push('tedavi');
    if (!date) missing.push('tarih');
    if (!time) missing.push('saat');
    
    return {
      success: false,
      error: `Eksik bilgi: ${missing.join(', ')}`,
      missingFields: missing
    };
  }

  let appointmentDate: Date;
  try {
    if (date.includes('/')) {
      const [day, month, year] = date.split('/');
      appointmentDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else if (date.includes('.')) {
      const [day, month, year] = date.split('.');
      appointmentDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      appointmentDate = new Date(date);
    }
    
    if (isNaN(appointmentDate.getTime())) {
      throw new Error('Invalid date');
    }
  } catch {
    return { success: false, error: 'Geçersiz tarih formatı' };
  }

  const existingAppointment = await prisma.appointment.findFirst({
    where: {
      doctor,
      date: appointmentDate,
      time,
      status: { not: 'cancelled' },
    },
  });

  if (existingAppointment) {
    const bookedTimes = await prisma.appointment.findMany({
      where: { doctor, date: appointmentDate, status: { not: 'cancelled' } },
      select: { time: true }
    });

    const allTimes = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];
    const availableTimes = allTimes.filter(t => !bookedTimes.map(b => b.time).includes(t));

    return {
      success: false,
      error: `Bu saat dolu. Müsait saatler: ${availableTimes.slice(0, 5).join(', ')}`,
      availableTimes
    };
  }

  const appointment = await prisma.appointment.create({
    data: {
      name,
      phone,
      email: email || null,
      doctor,
      service,
      date: appointmentDate,
      time,
      notes: notes || null,
    },
  });

  const formattedDate = appointmentDate.toLocaleDateString('tr-TR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return {
    success: true,
    message: `Randevunuz oluşturuldu! ${name} adına ${doctor} ile ${formattedDate} saat ${time}'de ${service} randevusu onaylandı. Randevu No: ${appointment.id.slice(-6).toUpperCase()}`,
    appointment: {
      id: appointment.id,
      confirmationCode: appointment.id.slice(-6).toUpperCase(),
      name, phone, doctor, service,
      date: formattedDate,
      time
    }
  };
}

// GET - Doktor ve hizmet bilgilerini getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctor = searchParams.get('doctor');
    const date = searchParams.get('date');

    const response: {
      success: boolean;
      doctors: { name: string; specialty: string }[];
      services: string[];
      availableTimes?: string[];
      workingHours: string;
    } = {
      success: true,
      doctors: [
        { name: 'Dr. Can Yılmaz', specialty: 'Pedodonti' },
        { name: 'Dr. Elif Demir', specialty: 'Ortodontist' },
        { name: 'Dr. Mehmet Öz', specialty: 'Çene Cerrahisi' },
      ],
      services: ['İmplant', 'Diş Beyazlatma', 'Kanal Tedavisi', 'Zirkonyum', 'Genel Kontrol', 'Diş Çekimi', 'Dolgu'],
      workingHours: 'Pazartesi-Cumartesi: 09:00-17:30'
    };

    if (doctor && date) {
      const appointmentDate = new Date(date);
      const bookedAppointments = await prisma.appointment.findMany({
        where: {
          doctor,
          date: appointmentDate,
          status: { not: 'cancelled' },
        },
        select: { time: true }
      });

      const allTimes = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];
      const bookedTimes = bookedAppointments.map(a => a.time);
      response.availableTimes = allTimes.filter(t => !bookedTimes.includes(t));
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in vapi GET:', error);
    return NextResponse.json(
      { success: false, error: 'Bilgiler alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}
