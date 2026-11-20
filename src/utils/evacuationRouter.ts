import { BuildingFloor, EvacuationPlan, EvacuationStep, Resident } from '../types';

export interface FloorGraphNode {
  id: string;
  nameEn: string;
  nameTh: string;
  isStaircase: boolean;
  isElevator: boolean;
  isRefugeArea: boolean;
  isWheelchairAccessible: boolean;
  x: number;
  y: number;
}

export interface FloorGraphEdge {
  from: string;
  to: string;
  distance: number;
  isAccessible: boolean;
}

// Floor layout graph definition (for standard floor like Floor 12)
export const floorNodes: Record<string, FloorGraphNode> = {
  unit_1204: {
    id: 'unit_1204',
    nameEn: 'Unit 1204 (Your Unit)',
    nameTh: 'ห้อง 1204 (ห้องของท่าน)',
    isStaircase: false,
    isElevator: false,
    isRefugeArea: false,
    isWheelchairAccessible: true,
    x: 210,
    y: 200,
  },
  corridor_central: {
    id: 'corridor_central',
    nameEn: 'Central Hallway Junction',
    nameTh: 'โถงทางเดินแยกกลาง',
    isStaircase: false,
    isElevator: false,
    isRefugeArea: false,
    isWheelchairAccessible: true,
    x: 350,
    y: 200,
  },
  corridor_north: {
    id: 'corridor_north',
    nameEn: 'North Corridor',
    nameTh: 'โถงทางเดินทิศเหนือ',
    isStaircase: false,
    isElevator: false,
    isRefugeArea: false,
    isWheelchairAccessible: true,
    x: 350,
    y: 110,
  },
  corridor_south: {
    id: 'corridor_south',
    nameEn: 'South Corridor',
    nameTh: 'โถงทางเดินทิศใต้',
    isStaircase: false,
    isElevator: false,
    isRefugeArea: false,
    isWheelchairAccessible: true,
    x: 350,
    y: 290,
  },
  stair_a: {
    id: 'stair_a',
    nameEn: 'Staircase A (West Core - Fire Protected)',
    nameTh: 'บันไดหนีไฟ A (แกนตะวันตก - ป้องกันควัน)',
    isStaircase: true,
    isElevator: false,
    isRefugeArea: false,
    isWheelchairAccessible: false,
    x: 120,
    y: 80,
  },
  stair_b: {
    id: 'stair_b',
    nameEn: 'Staircase B (East Core - Fire Protected)',
    nameTh: 'บันไดหนีไฟ B (แกนตะวันออก - ป้องกันควัน)',
    isStaircase: true,
    isElevator: false,
    isRefugeArea: false,
    isWheelchairAccessible: false,
    x: 580,
    y: 320,
  },
  passenger_elevators: {
    id: 'passenger_elevators',
    nameEn: 'Passenger Elevator Bank',
    nameTh: 'โถงลิฟต์โดยสาร',
    isStaircase: false,
    isElevator: true,
    isRefugeArea: false,
    isWheelchairAccessible: true,
    x: 480,
    y: 200,
  },
  refuge_area_12r: {
    id: 'refuge_area_12r',
    nameEn: 'Assistance Refuge Area 12-R (Fire Resistant with 2-Way Intercom)',
    nameTh: 'พื้นที่พักคอย 12-R (ห้องทนไฟ พร้อมระบบอินเตอร์คอมสองทาง)',
    isStaircase: false,
    isElevator: false,
    isRefugeArea: true,
    isWheelchairAccessible: true,
    x: 580,
    y: 100,
  },
};

export const calculateEvacuationRoute = (
  floor: BuildingFloor,
  resident: Resident,
  scenario: 'normal' | 'earthquake' | 'fire'
): EvacuationPlan => {
  const isFire = scenario === 'fire' || floor.hazards.fireDetected || floor.hazards.smokePpm > 100;
  const isEarthquake = scenario === 'earthquake' || floor.hazards.structuralDamage;
  const isNorthBlocked = floor.blockedCorridors.includes('corridor_north') || isFire;
  const isStairABlocked = floor.blockedCorridors.includes('stair_a') || isNorthBlocked;
  const isStairBBlocked = floor.blockedCorridors.includes('stair_b');
  const isWheelchair = resident.medicalInfo.wheelchairUser || resident.assistanceCategory === 'wheelchair';
  const hasHearingImpairment = resident.medicalInfo.hearingAssistance || resident.assistanceCategory === 'hearing';
  const hasVisualImpairment = resident.medicalInfo.visualAssistance || resident.assistanceCategory === 'visual';

  let recommendedStair: 'stair_a' | 'stair_b' | 'refuge_area' = 'stair_a';
  let reasonEn = 'Standard primary route via Staircase A (West Core). Corridor clear.';
  let reasonTh = 'เส้นทางหลักปกติ ผ่านบันไดหนีไฟ A (แกนตะวันตก) ทางเดินโล่งปลอดภัย';

  // Dynamic evaluation logic
  if (isWheelchair) {
    // Wheelchair user cannot use ordinary fire stairs alone without staff evac-chair
    if (floor.hasRefugeArea) {
      recommendedStair = 'refuge_area';
      reasonEn =
        'Wheelchair User Route: Proceed to Protected Refuge Area 12-R (Room has 2-hour fire rated door & emergency two-way intercom). Building Emergency Response Team has been dispatched with Stair Evacuation Chair.';
      reasonTh =
        'เส้นทางสำหรับผู้ใช้วีลแชร์: มุ่งหน้าสู่พื้นที่พักคอยทนไฟ 12-R (มีประตูกันไฟ 2 ชม. และอินเตอร์คอมสื่อสารสองทาง) ทีมกู้ภัยอาคารได้รับแจ้งและกำลังนำเก้าอี้ช่วยอพยพบันได (Evac Chair) เข้าช่วยเหลือ';
    } else {
      recommendedStair = 'stair_b';
      reasonEn =
        'Wheelchair User Route: Standby at Staircase B landing and await assigned building evacuation team with Evacuation Chair.';
      reasonTh =
        'เส้นทางสำหรับผู้ใช้วีลแชร์: เคลื่อนย้ายไปยังชานพักบันไดหนีไฟ B และรอทีมช่วยเหลือพร้อมเก้าอี้อพยพ';
    }
  } else if (isNorthBlocked || isStairABlocked) {
    if (!isStairBBlocked) {
      recommendedStair = 'stair_b';
      reasonEn =
        'Dynamic Reroute: Corridor North / Staircase A has simulated smoke hazard (elevated PPM). Rerouted via South Corridor to Staircase B (East Core).';
      reasonTh =
        'การเปลี่ยนเส้นทางอัตโนมัติ: โถงทางเดินทิศเหนือหรือบันได A มีควันหนาแน่น ระบบเปลี่ยนเส้นทางอัตโนมัติผ่านโถงทิศใต้ไปยังบันไดหนีไฟ B (แกนตะวันออก)';
    } else {
      recommendedStair = 'refuge_area';
      reasonEn =
        'CRITICAL: Both main stairwells reporting hazard. Instructed to shelter in place at Refuge Area 12-R and communicate via intercom.';
      reasonTh =
        'ภาวะวิกฤต: บันไดทั้งสองจุดมีสิ่งกีดขวาง โปรดเข้าหลบภัยในพื้นที่ทนไฟ 12-R ทันที และติดต่อเจ้าหน้าที่ผ่านอินเตอร์คอม';
    }
  }

  // Construct Personalized Step-by-Step Instructions
  const steps: EvacuationStep[] = [];

  if (isEarthquake) {
    steps.push({
      stepNumber: 1,
      titleEn: 'Drop, Cover, and Hold On',
      titleTh: 'หมอบ กำบัง และยึดแน่น (Drop, Cover, Hold On)',
      descriptionEn: 'Stay away from windows and heavy hanging objects. Protect your head under sturdy furniture until shaking stops.',
      descriptionTh: 'อยู่ห่างจากหน้าต่างและสิ่งของแขวนสูง กำบังศีรษะใต้โต๊ะที่แข็งแรงจนกว่าแรงสั่นสะเทือนจะสงบ',
      iconName: 'ShieldAlert',
      isCompleted: true,
      cautionEn: 'Do not run outside or into corridors while shaking is occurring.',
      cautionTh: 'ห้ามวิ่งออกนอกห้องหรือทางเดินขณะที่อาคารยังสั่นไหว',
    });
    steps.push({
      stepNumber: 2,
      titleEn: 'Check for Damage & Utility Hazards',
      titleTh: 'ตรวจสอบความเสียหายและระบบแก๊ส/ไฟฟ้า',
      descriptionEn: 'Check if door opens smoothly. Turn off master power switch if safe to do so.',
      descriptionTh: 'ตรวจสอบว่าประตูบิดเปิดได้ตามปกติ ปิดเบรกเกอร์ไฟฟ้าหลักหากทำได้อย่างปลอดภัย',
      iconName: 'CheckCircle2',
      isCompleted: false,
    });
    steps.push({
      stepNumber: 3,
      titleEn: 'Evacuate via Stairways (Never Elevators)',
      titleTh: 'อพยพทางบันไดหนีไฟ (ห้ามใช้ลิฟต์โดยสาร)',
      descriptionEn: `Proceed steadily via ${recommendedStair === 'stair_b' ? 'Staircase B' : 'Staircase A'}. Watch for floor debris.`,
      descriptionTh: `เดินลงอย่างมีสติผ่าน ${recommendedStair === 'stair_b' ? 'บันไดหนีไฟ B' : 'บันไดหนีไฟ A'} ระวังเศษวัสดุตกหล่น`,
      iconName: 'Footprints',
      isCompleted: false,
      cautionEn: 'Passenger elevators are automatically halted on safety sensors.',
      cautionTh: 'ระบบลิฟต์โดยสารตัดการทำงานอัตโนมัติแล้วเพื่อความปลอดภัย',
    });
    steps.push({
      stepNumber: 4,
      titleEn: 'Report Safety at Assembly Point',
      titleTh: 'รายงานตัว ณ จุดรวมพลภายนอกอาคาร',
      descriptionEn: 'Muster at North Garden Assembly Ground and tap Safety Check-in below.',
      descriptionTh: 'รวมพลที่สวนทิศเหนือของโครงการ และกดปุ่มเช็คอินความปลอดภัยในแอป',
      iconName: 'MapPin',
      isCompleted: false,
    });
  } else if (isWheelchair) {
    steps.push({
      stepNumber: 1,
      titleEn: 'Check Door & Prepare for Refuge Relocation',
      titleTh: 'ตรวจสอบประตูและเตรียมพร้อมสู่จุดพักคอย',
      descriptionEn: 'Touch door handle. If cool, carefully open door of Unit 1204 with wheelchair.',
      descriptionTh: 'ใช้หลังมือสัมผัสลูกบิดประตู หากไม่ร้อน ค่อยๆ บังคับเก้าอี้รถเข็นออกจากห้อง 1204',
      iconName: 'DoorClosed',
      isCompleted: true,
    });
    steps.push({
      stepNumber: 2,
      titleEn: 'Navigate South Corridor to Refuge Area 12-R',
      titleTh: 'ใช้โถงทางเดินทิศใต้มุ่งหน้าสู่พื้นที่พักคอย 12-R',
      descriptionEn: 'Follow step-free corridor path directly into reinforced Room 12-R.',
      descriptionTh: 'เคลื่อนที่ตามทางเดินเรียบไร้ขั้นบันไดตรงเข้าสู่ห้องทนไฟ 12-R',
      iconName: 'Accessibility',
      isCompleted: false,
    });
    steps.push({
      stepNumber: 3,
      titleEn: 'Activate 2-Way Intercom in Room 12-R',
      titleTh: 'กดปุ่มสื่อสารอินเตอร์คอมสองทางในห้อง 12-R',
      descriptionEn: 'Press the red button on the wall intercom to speak directly with Security Control Room.',
      descriptionTh: 'กดปุ่มสีแดงบนแผงอินเตอร์คอมติดผนังเพื่อสื่อสารกับห้องควบคุมอาคารโดยตรง',
      iconName: 'PhoneCall',
      isCompleted: false,
      cautionEn: 'Team Alpha (Officer Wichai) is en route with portable stair evac-chair.',
      cautionTh: 'เจ้าหน้าที่วิชัย (ทีมแอลฟ่า) กำลังนำเก้าอี้ช่วยอพยพขึ้นมาช่วยเหลือท่าน',
    });
    steps.push({
      stepNumber: 4,
      titleEn: 'Confirm Safety Check-in with Responders',
      titleTh: 'ยืนยันการเช็คอินความปลอดภัยเมื่อพบเจ้าหน้าที่',
      descriptionEn: 'Confirm arrival at safe zone once assisted to ground level.',
      descriptionTh: 'กดยืนยันความปลอดภัยในระบบเมื่อได้รับการช่วยเหลือลงสู่ชั้นล่างเรียบร้อยแล้ว',
      iconName: 'ShieldCheck',
      isCompleted: false,
    });
  } else {
    // Standard fire evacuation
    steps.push({
      stepNumber: 1,
      titleEn: 'Check Door Temperature & Exit Unit 1204',
      titleTh: 'ตรวจสอบความร้อนของประตูและออกจากห้อง 1204',
      descriptionEn: 'Check handle with back of hand. If cool, stay low and open carefully.',
      descriptionTh: 'ใช้หลังมือสัมผัสประตู หากไม่ร้อน ให้ก้มตัวต่ำและเปิดประตูอย่างระมัดระวัง',
      iconName: 'DoorClosed',
      isCompleted: true,
      cautionEn: 'If door is hot, do not open! Place damp towels at bottom seal and call Control Room.',
      cautionTh: 'หากประตูร้อน ห้ามเปิด! นำผ้าชุบน้ำอุดใต้ประตู และกดปุ่ม SOS ทันที',
    });
    steps.push({
      stepNumber: 2,
      titleEn: isNorthBlocked ? 'Turn South (North Corridor Blocked by Smoke)' : 'Follow Corridor to Fire Stairs',
      titleTh: isNorthBlocked ? 'เลี้ยวไปทางทิศใต้ (โถงทิศเหนือมีควันหนาแน่น)' : 'เดินตามโถงทางเดินสู่บันไดหนีไฟ',
      descriptionEn: isNorthBlocked
        ? 'Avoid North Corridor. Head South following green emergency floor indicators.'
        : 'Follow overhead exit signs toward Staircase A.',
      descriptionTh: isNorthBlocked
        ? 'หลีกเลี่ยงโถงทิศเหนือ เลี้ยวไปทางทิศใต้ตามไฟนำทางฉุกเฉินสีเขียวบนพื้น'
        : 'เดินตามป้ายทางออกฉุกเฉินมุ่งหน้าสู่บันไดหนีไฟ A',
      iconName: 'Navigation',
      isCompleted: false,
    });
    steps.push({
      stepNumber: 3,
      titleEn: `Enter ${recommendedStair === 'stair_b' ? 'Staircase B' : 'Staircase A'} & Descend Steadily`,
      titleTh: `เข้าสู่ ${recommendedStair === 'stair_b' ? 'บันไดหนีไฟ B' : 'บันไดหนีไฟ A'} และเดินลงอย่างมีสติ`,
      descriptionEn: 'Push fire door open and allow it to close completely. Descend on right side.',
      descriptionTh: 'ผลักประตูกันไฟเข้าไปและปล่อยให้ประตูปิดสนิท เดินลงทางขวาอย่างมีระเบียบ',
      iconName: 'Footprints',
      isCompleted: false,
      cautionEn: 'NEVER use passenger elevators during fire evacuation!',
      cautionTh: 'ห้ามใช้ลิฟต์โดยสารเด็ดขาดขณะเกิดเหตุเพลิงไหม้!',
    });
    steps.push({
      stepNumber: 4,
      titleEn: 'Muster at North Garden & Submit Check-in',
      titleTh: 'รวมพลที่สวนทิศเหนือและส่งข้อมูลเช็คอิน',
      descriptionEn: 'Arrive at designated assembly point and tap "I Am Safe" below.',
      descriptionTh: 'เมื่อถึงจุดรวมพลปลอดภัย ให้กดปุ่ม "ฉันปลอดภัยแล้ว" ด้านล่าง',
      iconName: 'MapPin',
      isCompleted: false,
    });
  }

  // Adjust guidance notes for accessibility
  if (hasHearingImpairment) {
    reasonEn += ' [High-intensity flashing visual emergency beacons active on floor]';
    reasonTh += ' [ระบบสัญญาณไฟกระพริบเตือนภัยทำงานแล้วบนชั้นนี้]';
  }
  if (hasVisualImpairment) {
    reasonEn += ' [Audible directional voice sounders active along corridor]';
    reasonTh += ' [มีเสียงประกาศเตือนภัยนำทางแบบมีทิศทางทำงานตามทางเดิน]';
  }

  return {
    floorNumber: floor.floorNumber,
    recommendedStair,
    stairAStatus: isStairABlocked ? 'hazard' : 'open',
    stairBStatus: isStairBBlocked ? 'hazard' : 'open',
    elevatorsStatus: isFire ? 'disabled_fire' : isEarthquake ? 'disabled_quake' : 'operational',
    refugeAreaAvailable: floor.hasRefugeArea,
    reasonEn,
    reasonTh,
    staffVerified: true,
    verifiedBy: 'Somkid Jaidee (Security Control)',
    steps,
  };
};
