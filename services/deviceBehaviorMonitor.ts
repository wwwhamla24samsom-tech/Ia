/**
 * خدمات رصد سلوك الأجهزة المتصلة والحماية من الوصول غير المصرح به
 * Device Behavior Telemetry & Unauthorized Access Detection
 */

export interface ConnectedDevice {
  id: string;
  name: string;
  ipAddress: string;
  fingerprint: string;
  deviceType: 'desktop' | 'mobile' | 'server' | 'quantum_node' | 'unknown';
  trustStatus: 'trusted' | 'suspicious' | 'blocked' | 'auditing';
  lastSeen: string;
  location: string;
  behaviorScore: number; // 0 to 100 (higher is safer)
  accessAttempts: number;
  unauthorizedAttempts: number;
  anomalyFlags: string[];
}

export interface SecurityEventAlert {
  id: string;
  timestamp: string;
  deviceId: string;
  deviceName: string;
  ipAddress: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  eventType: string;
  description: string;
  interceptedData: string;
  actionTaken: 'BLOCKED' | 'FLAGGED' | 'ISOLATED_SANDBOX' | 'CHALLENGE_ISSUED';
}

class DeviceBehaviorMonitorEngine {
  private static instance: DeviceBehaviorMonitorEngine;
  private devices: ConnectedDevice[] = [
    {
      id: 'DEV-NODE-8801',
      name: 'محطة العمل الأساسية (Admin Terminal)',
      ipAddress: '192.168.1.100 (محلية)',
      fingerprint: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      deviceType: 'desktop',
      trustStatus: 'trusted',
      lastSeen: 'الآن',
      location: 'المنطقة الآمنة الداخلية',
      behaviorScore: 99,
      accessAttempts: 1420,
      unauthorizedAttempts: 0,
      anomalyFlags: []
    },
    {
      id: 'DEV-NODE-9904',
      name: 'عقدة تتبع متنقلة (Mobile Telemetry)',
      ipAddress: '10.0.4.82 (VPN نفق مشفر)',
      fingerprint: 'SHA256:5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      deviceType: 'mobile',
      trustStatus: 'trusted',
      lastSeen: 'منذ دقيقة',
      location: 'بوابة العبور الآمنة',
      behaviorScore: 94,
      accessAttempts: 630,
      unauthorizedAttempts: 0,
      anomalyFlags: []
    },
    {
      id: 'DEV-ANOMALY-4412',
      name: 'جهاز خارجي غير معروف (Unidentified Node)',
      ipAddress: '185.220.101.5 (خارجي مشبوه)',
      fingerprint: 'SHA256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      deviceType: 'unknown',
      trustStatus: 'blocked',
      lastSeen: 'منذ 3 ثوان',
      location: 'عقدة توجيه غير مصرح بها',
      behaviorScore: 12,
      accessAttempts: 88,
      unauthorizedAttempts: 88,
      anomalyFlags: [
        'محاولة قراءة جداول الذاكرة بدون توقيع',
        'تكرار محاولات المصادقة برقم تعريفي مزيف',
        'محاولة تجاوز فحص المفتاح النوروني'
      ]
    }
  ];

  private alerts: SecurityEventAlert[] = [
    {
      id: 'ALT-9011',
      timestamp: '00:54:12',
      deviceId: 'DEV-ANOMALY-4412',
      deviceName: 'جهاز خارجي غير معروف',
      ipAddress: '185.220.101.5',
      severity: 'critical',
      eventType: 'UNAUTHORIZED_DATA_PROBE',
      description: 'تم رصد محاولة وصول وقراءة غير مصرح بها للبيانات الحساسة في الذاكرة النورونية.',
      interceptedData: 'QUERY: SELECT * FROM kernel_neural_keys WHERE level="master"',
      actionTaken: 'BLOCKED'
    }
  ];

  public static getInstance(): DeviceBehaviorMonitorEngine {
    if (!this.instance) {
      this.instance = new DeviceBehaviorMonitorEngine();
    }
    return this.instance;
  }

  public getConnectedDevices(): ConnectedDevice[] {
    return [...this.devices];
  }

  public getAlerts(): SecurityEventAlert[] {
    return [...this.alerts];
  }

  public blockDevice(deviceId: string): void {
    const dev = this.devices.find(d => d.id === deviceId);
    if (dev) {
      dev.trustStatus = 'blocked';
      dev.behaviorScore = 0;
      this.addAlert({
        deviceId: dev.id,
        deviceName: dev.name,
        ipAddress: dev.ipAddress,
        severity: 'high',
        eventType: 'DEVICE_MANUALLY_ISOLATED',
        description: `تم عزل وحظر الجهاز [${dev.name}] فوراً بواسطة مسؤول النظام السيادي.`,
        interceptedData: 'ACTION: ISOLATE_PACKET_STREAM',
        actionTaken: 'ISOLATED_SANDBOX'
      });
    }
  }

  public trustDevice(deviceId: string): void {
    const dev = this.devices.find(d => d.id === deviceId);
    if (dev) {
      dev.trustStatus = 'trusted';
      dev.behaviorScore = 95;
      dev.anomalyFlags = [];
    }
  }

  public simulateUnauthorizedAccess(): SecurityEventAlert {
    const randomIp = `198.51.100.${Math.floor(Math.random() * 200 + 10)}`;
    const randomId = `DEV-ROGUE-${Math.floor(Math.random() * 9000 + 1000)}`;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    const newAlert: SecurityEventAlert = {
      id: `ALT-${Math.floor(Math.random() * 9000 + 1000)}`,
      timestamp: timeStr,
      deviceId: randomId,
      deviceName: 'عقدة فحص متطفلة (Rogue Probe)',
      ipAddress: randomIp,
      severity: 'critical',
      eventType: 'UNAUTHORIZED_DATA_EXFILTRATION_ATTEMPT',
      description: 'محاولة وصول فوري غير مصرح بها لقراءة مفاتيح التشفير وسجلات النواة.',
      interceptedData: `INTERCEPT: GET /kernel/protected_payloads?token=INVALID_${Math.random().toString(36).substring(7)}`,
      actionTaken: 'BLOCKED'
    };

    // Add or update rogue device
    const existingIndex = this.devices.findIndex(d => d.id === randomId);
    if (existingIndex >= 0) {
      this.devices[existingIndex].unauthorizedAttempts++;
      this.devices[existingIndex].behaviorScore = Math.max(0, this.devices[existingIndex].behaviorScore - 20);
    } else {
      this.devices.unshift({
        id: randomId,
        name: 'عقدة فحص متطفلة (Rogue Probe)',
        ipAddress: randomIp,
        fingerprint: `SHA256:${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
        deviceType: 'unknown',
        trustStatus: 'suspicious',
        lastSeen: 'الآن',
        location: 'شبكة خارجية غير موثوقة',
        behaviorScore: 25,
        accessAttempts: 12,
        unauthorizedAttempts: 12,
        anomalyFlags: ['محاولة الوصول بدون توثيق', 'انحراف في نمط الاستعلام']
      });
      if (this.devices.length > 8) this.devices.pop();
    }

    this.addAlert(newAlert);
    return newAlert;
  }

  private addAlert(alertData: Omit<SecurityEventAlert, 'id' | 'timestamp'> & { id?: string; timestamp?: string }): void {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const alert: SecurityEventAlert = {
      id: alertData.id || `ALT-${Math.floor(Math.random() * 9000 + 1000)}`,
      timestamp: alertData.timestamp || timeStr,
      ...alertData
    };
    this.alerts.unshift(alert);
    if (this.alerts.length > 20) {
      this.alerts.pop();
    }
  }
}

export const deviceBehaviorMonitor = DeviceBehaviorMonitorEngine.getInstance();
