import { useState, useEffect, useCallback } from "react";
import { CostItem, OneTimeCosts, OngoingCosts } from "./components/ICalculator";
import { CostSection } from "./components/CostSection";

const initialOngoingCosts: OngoingCosts = {
  childcare: {
    regularCare: {
      name: "I'll pay for childcare",
      amount: 725,
      months: 9,
      enabled: true,
    },
    babysitter: {
      name: "I'll use an occasional babysitter",
      amount: 0,
      months: 12,
      enabled: true,
    },
  },
  diapering: {
    diapers: { name: "I'll be using", amount: 76, months: 12, enabled: true },
    wipes: { name: "Wipes", amount: 16, months: 12, enabled: true },
  },
  feeding: {
    formula: {
      name: "Formula. I'll spend",
      amount: 183,
      months: 9,
      enabled: true,
    },
    solidFood: {
      name: "Solid food. I'll spend",
      amount: 66,
      months: 6,
      enabled: true,
    },
  },
  items: {
    clothing: {
      name: "I'll pay for clothing",
      amount: 82,
      months: 12,
      enabled: true,
    },
    toys: {
      name: "I'll pay for toys",
      amount: 13,
      months: 12,
      enabled: true,
    },
  },
};

const initialOneTimeCosts: OneTimeCosts = {
  gear: {
    carSeat: { name: "Infant car seat", amount: 230, enabled: true },
    convertibleCarSeat: {
      name: "Convertible car seat",
      amount: 0,
      enabled: true,
    },
    stroller: { name: "Basic stroller", amount: 309, enabled: true },
    doubleStroller: { name: "Double stroller", amount: 0, enabled: true },
    joggingStroller: { name: "Jogging stroller", amount: 0, enabled: true },
    playYard: { name: "Play yard", amount: 223, enabled: true },
    carrier: { name: "Baby carrier", amount: 36, enabled: true },
    diaperBag: { name: "Diaper bag", amount: 80, enabled: true },
  },
  activityEquipment: {
    babySwing: { name: "Baby swing", amount: 0, enabled: true },
    babyBouncer: { name: "Baby bouncer or rocker", amount: 200, enabled: true },
    activityCenter: {
      name: "Baby activity center",
      amount: 142,
      enabled: true,
    },
    playMat: { name: "Baby play mat", amount: 166, enabled: true },
    playGym: { name: "Baby play gym", amount: 48, enabled: true },
  },
  nursery: {
    crib: { name: "Crib", amount: 210, enabled: true },
    mattress: { name: "Crib mattress", amount: 168, enabled: true },
    sheets: { name: "Crib sheets", amount: 60, enabled: true },
    changingTable: {
      name: "Changing table and pad",
      amount: 159,
      enabled: true,
    },
    diaperPail: { name: "Diaper pail", amount: 48, enabled: true },
    glider: { name: "Glider or rocker", amount: 213, enabled: true },
    bassinet: { name: "Bassinet", amount: 247, enabled: true },
    hamper: { name: "Hamper", amount: 35, enabled: true },
    mobile: { name: "Crib mobile", amount: 0, enabled: true },
    monitor: { name: "Baby monitor", amount: 177, enabled: true },
    soundMachine: { name: "Sound machine", amount: 70, enabled: true },
  },
  feeding: {
    bottles: { name: "Bottles and nipples", amount: 56, enabled: true },
    highchair: { name: "Highchair", amount: 200, enabled: true },
    utensils: { name: "Utensils", amount: 5, enabled: true },
    plates: { name: "Plates and bowls", amount: 45, enabled: true },
    sippyCups: { name: "Sippy cups", amount: 26, enabled: true },
    burpCloths: { name: "Burp cloths", amount: 49, enabled: true },
    bottleBrushes: { name: "Bottle brushes", amount: 35, enabled: true },
    bibs: { name: "Bibs", amount: 20, enabled: true },
  },
  breastfeeding: {
    electricPump: { name: "Electric breast pump", amount: 0, enabled: true },
    manualPump: { name: "Manual breast pump", amount: 0, enabled: true },
    supplies: {
      name: "Nursing pads, milk storage bags, and other supplies",
      amount: 190,
      enabled: true,
    },
    bras: { name: "Nursing bras", amount: 147, enabled: true },
    pillow: { name: "Nursing pillow", amount: 45, enabled: true },
  },
  bathingGrooming: {
    towel: { name: "Hooded baby towel", amount: 52, enabled: true },
    bathtub: { name: "Baby bathtub", amount: 45, enabled: true },
    washcloths: { name: "Baby washcloths", amount: 14, enabled: true },
    groomingKit: { name: "Baby grooming kit", amount: 33, enabled: true },
    shampoo: { name: "Baby shampoo and wash", amount: 46, enabled: true },
  },
  healthSafety: {
    babyproofing: { name: "Babyproofing supplies", amount: 7, enabled: true },
    firstAidKit: { name: "First-aid kit", amount: 10, enabled: true },
    safetyGate: { name: "Safety gate", amount: 50, enabled: true },
    pacifiers: { name: "Pacifiers", amount: 12, enabled: true },
    humidifier: { name: "Humidifier", amount: 0, enabled: true },
    airPurifier: { name: "Air purifier", amount: 0, enabled: true },
    miscellaneous: { name: "Miscellaneous", amount: 47, enabled: true },
  },
};

export default function CostCalculatorContainer() {
  const [ongoingCosts, setOngoingCosts] =
    useState<OngoingCosts>(initialOngoingCosts);

  const [oneTimeCosts, setOneTimeCosts] =
    useState<OneTimeCosts>(initialOneTimeCosts);

  const [total, setTotal] = useState(0);

  const USD_TO_VND_RATE = 24000; // Example rate

  const convertToVND = (amount: number): number => {
    return amount * USD_TO_VND_RATE;
  };

  const calculateSubtotal = useCallback(
    (items: Record<string, CostItem>): number => {
      return Object.values(items).reduce((sum, item) => {
        if (item.enabled === false) return sum;
        const amount = Number(item.amount) || 0;
        const months = Number(item.months) || 1;
        return sum + amount * months;
      }, 0);
    },
    []
  );

  const handleOngoingCostChange = useCallback(
    (section: keyof OngoingCosts, key: string, updates: Partial<CostItem>) => {
      setOngoingCosts((prev) => {
        const sectionData = prev[section];

        // Ensure sectionData is an object before spreading
        if (typeof sectionData !== "object" || sectionData === null) {
          return prev;
        }

        return {
          ...prev,
          [section]: {
            ...(sectionData as Record<string, CostItem>),
            [key]: {
              ...(sectionData as Record<string, CostItem>)[key],
              ...updates,
            },
          },
        };
      });
    },
    []
  );

  const handleOneTimeCostChange = useCallback(
    (section: keyof OneTimeCosts, key: string, updates: Partial<CostItem>) => {
      setOneTimeCosts((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: {
            ...prev[section][key],
            ...updates,
          },
        },
      }));
    },
    []
  );

  useEffect(() => {
    const calculateTotal = (costs: Record<string, any>): number => {
      return Object.values(costs).reduce((total, section) => {
        // If the section itself is a CostItem, process it directly
        if (
          typeof section === "object" &&
          section !== null &&
          "amount" in section &&
          "enabled" in section
        ) {
          return section.enabled
            ? total + section.amount * (section.months ?? 1)
            : total;
        }

        // Otherwise, process it as a nested section containing multiple CostItems
        return (
          total +
          Object.values(section as Record<string, CostItem>).reduce(
            (sectionTotal, item) => {
              if (!item.enabled) return sectionTotal;
              return sectionTotal + item.amount * (item.months ?? 1);
            },
            0
          )
        );
      }, 0);
    };

    const ongoingTotal = calculateTotal(ongoingCosts);
    const oneTimeTotal = calculateTotal(oneTimeCosts);

    const newTotal = ongoingTotal + oneTimeTotal;
    setTotal(Math.round(newTotal * 100) / 100); // Round to 2 decimal places
  }, [ongoingCosts, oneTimeCosts]);

  return (
    <div className=" mx-56 my-10 p-10 space-y-6 bg-emerald-400 rounded-lg text-sky-800">
      <div className="bg-emerald-100 p-6 rounded-lg">
        <h2 className="text-lg font-medium">
          Your baby's first year may cost around:
        </h2>
        <p className="text-2xl font-bold">
          Total cost:{" "}
          {convertToVND(total).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}{" "}
          VNĐ
        </p>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-medium">Ongoing costs</h3>

        <CostSection
          title="Childcare"
          items={ongoingCosts.childcare}
          onItemChange={(key, updates) =>
            handleOngoingCostChange("childcare", key, updates)
          }
          showSubtotal
          subtotal={calculateSubtotal(ongoingCosts.childcare)}
        />

        <CostSection
          title="Diapering"
          items={ongoingCosts.diapering}
          onItemChange={(key, updates) =>
            handleOngoingCostChange("diapering", key, updates)
          }
          showSubtotal
          subtotal={calculateSubtotal(ongoingCosts.diapering)}
        />

        <CostSection
          title="Feeding"
          items={ongoingCosts.feeding}
          onItemChange={(key, updates) =>
            handleOngoingCostChange("feeding", key, updates)
          }
          showSubtotal
          subtotal={calculateSubtotal(ongoingCosts.feeding)}
        />
        <CostSection
          title="Items"
          items={ongoingCosts.items}
          onItemChange={(key, updates) =>
            handleOngoingCostChange("items", key, updates)
          }
          showSubtotal
          subtotal={calculateSubtotal(ongoingCosts.items)}
        />
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-medium">One-time costs</h3>

        <CostSection
          title="Gear"
          items={oneTimeCosts.gear}
          onItemChange={(key, updates) =>
            handleOneTimeCostChange("gear", key, updates)
          }
          showSubtotal
          subtotal={calculateSubtotal(oneTimeCosts.gear)}
        />

        <CostSection
          title="Activity Equipment"
          items={oneTimeCosts.activityEquipment}
          onItemChange={(key, updates) =>
            handleOneTimeCostChange("activityEquipment", key, updates)
          }
          showSubtotal
          subtotal={calculateSubtotal(oneTimeCosts.activityEquipment)}
        />

        <CostSection
          title="Nursery"
          items={oneTimeCosts.nursery}
          onItemChange={(key, updates) =>
            handleOneTimeCostChange("nursery", key, updates)
          }
          showSubtotal
          subtotal={calculateSubtotal(oneTimeCosts.nursery)}
        />

        <CostSection
          title="Feeding"
          items={oneTimeCosts.feeding}
          onItemChange={(key, updates) =>
            handleOneTimeCostChange("feeding", key, updates)
          }
          showSubtotal
          subtotal={calculateSubtotal(oneTimeCosts.feeding)}
        />

        <CostSection
          title="Breastfeeding"
          items={oneTimeCosts.breastfeeding}
          onItemChange={(key, updates) =>
            handleOneTimeCostChange("breastfeeding", key, updates)
          }
          showSubtotal
          subtotal={calculateSubtotal(oneTimeCosts.breastfeeding)}
        />

        <CostSection
          title="Bathing and Grooming"
          items={oneTimeCosts.bathingGrooming}
          onItemChange={(key, updates) =>
            handleOneTimeCostChange("bathingGrooming", key, updates)
          }
          showSubtotal
          subtotal={calculateSubtotal(oneTimeCosts.bathingGrooming)}
        />

        <CostSection
          title="Health and Safety"
          items={oneTimeCosts.healthSafety}
          onItemChange={(key, updates) =>
            handleOneTimeCostChange("healthSafety", key, updates)
          }
          showSubtotal
          subtotal={calculateSubtotal(oneTimeCosts.healthSafety)}
        />
      </div>
    </div>
  );
}
