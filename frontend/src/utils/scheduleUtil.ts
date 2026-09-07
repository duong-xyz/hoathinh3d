// ==========================================
// 1. CONSTANTS & TYPES
// ==========================================

export interface DayOption {
    key: string;      // Mã viết tắt (dùng cho logging / API phụ)
    label: string;    // Nhãn hiển thị UI
    bit: number;      // Giá trị Bitmask (2^n)
}

/**
 * Danh sách các ngày trong tuần chuẩn hóa với Bitmask của Backend
 */
export const DAYS_CONFIG: DayOption[] = [
    { key: 'MON', label: 'Thứ Hai', bit: 1 },  // 1 << 0
    { key: 'TUE', label: 'Thứ Ba', bit: 2 },  // 1 << 1
    { key: 'WED', label: 'Thứ Tư', bit: 4 },  // 1 << 2
    { key: 'THU', label: 'Thứ Năm', bit: 8 },  // 1 << 3
    { key: 'FRI', label: 'Thứ Sáu', bit: 16 }, // 1 << 4
    { key: 'SAT', label: 'Thứ Bảy', bit: 32 }, // 1 << 5
    { key: 'SUN', label: 'Chủ Nhật', bit: 64 }, // 1 << 6
];

export interface ParsedSchedule {
    time: string;           // HH:mm (VD: "20:00")
    normalBitmask: number;  // Bitmask chiếu chính
    earlyBitmask: number;   // Bitmask chiếu sớm
    selectedBits: number[]; // Danh sách các bit lẻ đã chọn (VD: [1, 16])
}

// ==========================================
// 2. HELPER UTILS (BITWISE LOGIC)
// ==========================================

export class ScheduleUtils {
    /**
     * Tách chuỗi schedule từ Backend gửi lên thành Object dễ dùng
     * @param scheduleStr Chuỗi dạng "HH:mm|NormalBit|EarlyBit" (VD: "20:00|17|0")
     */
    static parse(scheduleStr?: string | null): ParsedSchedule {
        const defaultResult: ParsedSchedule = {
            time: '20:00',
            normalBitmask: 16, // Mặc định Thứ 6
            earlyBitmask: 0,
            selectedBits: [16],
        };

        if (!scheduleStr || typeof scheduleStr !== 'string' || !scheduleStr.includes('|')) {
            return defaultResult;
        }

        const parts = scheduleStr.split('|');
        const time = parts[0] || '20:00';
        const normalBitmask = parseInt(parts[1], 10) || 0;
        const earlyBitmask = parseInt(parts[2], 10) || 0;

        // Phân tích Bitmask thành mảng các Bit lẻ
        const selectedBits = DAYS_CONFIG.filter((day) => (normalBitmask & day.bit) !== 0).map(
            (day) => day.bit
        );

        return {
            time,
            normalBitmask,
            earlyBitmask,
            selectedBits,
        };
    }

    /**
     * Đóng gói các thông số thành chuỗi chuẩn gửi xuống Backend
     * @example format("20:00", 17, 0) => "20:00|17|0"
     */
    static format(time: string, normalBitmask: number, earlyBitmask: number = 0): string {
        const validTime = time || '20:00';
        return `${validTime}|${normalBitmask}|${earlyBitmask}`;
    }

    /**
     * Bật / Tắt 1 ngày trong Bitmask (Toggle Day) bằng phép toán Bitwise XOR
     */
    static toggleDayBit(currentBitmask: number, dayBit: number): number {
        return currentBitmask ^ dayBit;
    }

    /**
     * Kiểm tra xem 1 ngày cụ thể có được chọn trong Bitmask hay không
     */
    static isDaySelected(currentBitmask: number, dayBit: number): boolean {
        return (currentBitmask & dayBit) !== 0;
    }

    /**
     * Chuyển đổi Bitmask thành chuỗi văn bản thân thiện hiển thị cho người dùng
     * @example "20:00|17|8" => "Thứ Hai, Thứ Sáu (Sớm: Thứ Năm) - 20:00"
     */
    static toHumanReadable(scheduleStr?: string | null): string {
        if (!scheduleStr) return 'Chưa có lịch chiếu';

        const { time, normalBitmask, earlyBitmask } = this.parse(scheduleStr);

        // Lấy danh sách ngày chiếu chính
        const normalDays = DAYS_CONFIG
            .filter((day) => (normalBitmask & day.bit) !== 0)
            .map((day) => day.label);

        // Lấy danh sách ngày chiếu sớm
        const earlyDays = DAYS_CONFIG
            .filter((day) => (earlyBitmask & day.bit) !== 0)
            .map((day) => day.label);

        if (normalDays.length === 0 && earlyDays.length === 0) {
            return `Chưa chọn ngày (${time})`;
        }

        const normalText = normalDays.length === 7 ? 'Mỗi ngày' : normalDays.join(', ');
        const earlyText = earlyDays.length > 0 ? ` (Sớm: ${earlyDays.join(', ')})` : '';

        return `${normalText}${earlyText} - ${time}`;
    }

    static toHumanReadable2(scheduleStr?: string | null): {normal: string, early: string} | string {
        if (!scheduleStr) return 'Chưa có lịch chiếu';

        const { time, normalBitmask, earlyBitmask } = this.parse(scheduleStr);

        // Lấy danh sách ngày chiếu chính
        const normalDays = DAYS_CONFIG
            .filter((day) => (normalBitmask & day.bit) !== 0)
            .map((day) => day.label);

        // Lấy danh sách ngày chiếu sớm
        const earlyDays = DAYS_CONFIG
            .filter((day) => (earlyBitmask & day.bit) !== 0)
            .map((day) => day.label);

        if (normalDays.length === 0 && earlyDays.length === 0) {
            return `Chưa chọn ngày (${time})`;
        }

        const normalText = normalDays.length === 7 ? 'Mỗi ngày' : normalDays.join(', ');
        const earlyText = earlyDays.length > 0 ? `Sớm: ${earlyDays.join(', ')}` : '';

        return {normal: normalText, early: earlyText};
    }
}