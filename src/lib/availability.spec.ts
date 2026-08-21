import { isCarAvailable, type CarInput, type Query } from "./availability";
import type { AdminBooking } from "./adminBookings";

const car: CarInput = { slug: "x5", baseCity: "batumi" };

const mk = (pickupDate: string, returnDate: string, pickupCity: string, returnCity: string): AdminBooking => ({
  id: Math.random().toString(), carSlug: "x5", carName: "X5", carBaseCity: "batumi",
  pickupCity, returnCity, pickupDate, returnDate, pickupTime: "11:00", returnTime: "11:00",
  pickupType: "office", deliveryAddress: "", services: [], clientName: "", clientPassport: "",
  clientLicense: "", clientPhone: "", clientContact: "whatsapp", pricePerDay: 0, totalPrice: 0,
  deposit: 150, days: 0, contractNumber: "1", note: "", createdAt: "",
});

const q = (pickupCity: string, pickupDate: string, returnCity: string, returnDate: string): Query =>
  ({ pickupCity: pickupCity as any, pickupDate, returnCity: returnCity as any, returnDate });

let pass = 0, fail = 0;
function expect(name: string, got: boolean, want: boolean) {
  if (got === want) { pass++; console.log(`✓ ${name}`); }
  else { fail++; console.log(`✗ ${name}  got=${got} want=${want}`); }
}

// Test 1: 22-24 Bat→Tbi ; req 25-26 Bat→Bat => NOT available
expect("Test1", isCarAvailable(car, [mk("2026-08-22","2026-08-24","batumi","tbilisi")], [], q("batumi","2026-08-25","batumi","2026-08-26")).ok, false);
// Test 2: same ; req 27-28 Bat→Bat => available
expect("Test2", isCarAvailable(car, [mk("2026-08-22","2026-08-24","batumi","tbilisi")], [], q("batumi","2026-08-27","batumi","2026-08-28")).ok, true);
// Test 3: same ; req 25-26 Tbi→Tbi => available
expect("Test3", isCarAvailable(car, [mk("2026-08-22","2026-08-24","batumi","tbilisi")], [], q("tbilisi","2026-08-25","tbilisi","2026-08-26")).ok, true);
// Test 4: 22-24 Tbi→Bat ; req 25-26 Tbi→Tbi => NOT available
expect("Test4", isCarAvailable(car, [mk("2026-08-22","2026-08-24","tbilisi","batumi")], [], q("tbilisi","2026-08-25","tbilisi","2026-08-26")).ok, false);
// Test 5: 22-24 Bat→Bat ; req 25-26 Bat→Bat => available
expect("Test5", isCarAvailable(car, [mk("2026-08-22","2026-08-24","batumi","batumi")], [], q("batumi","2026-08-25","batumi","2026-08-26")).ok, true);
// Test 6: 22-24 Bat→Tbi + next 25-28 Tbi→Tbi ; req 25-26 Bat→Bat => NOT available
expect("Test6", isCarAvailable(car, [mk("2026-08-22","2026-08-24","batumi","tbilisi"), mk("2026-08-25","2026-08-28","tbilisi","tbilisi")], [], q("batumi","2026-08-25","batumi","2026-08-26")).ok, false);
// §12: 20-22 Bat→Tbi + 25-28 Tbi→Tbi ; req 23-24 Bat→Bat => NOT available (car in Tbilisi, no transfer time)
expect("§12", isCarAvailable(car, [mk("2026-08-20","2026-08-22","batumi","tbilisi"), mk("2026-08-25","2026-08-28","tbilisi","tbilisi")], [], q("batumi","2026-08-23","batumi","2026-08-24")).ok, false);
// Extra: after chain, available in Tbilisi 29-30 (>= 28, same city as last return Tbilisi)
expect("chain-tbi-ok", isCarAvailable(car, [mk("2026-08-20","2026-08-22","batumi","tbilisi"), mk("2026-08-25","2026-08-28","tbilisi","tbilisi")], [], q("tbilisi","2026-08-29","tbilisi","2026-08-30")).ok, true);
// Extra: back in Batumi only from 31 (28 + 3) after last Tbilisi booking
expect("chain-bat-too-early", isCarAvailable(car, [mk("2026-08-20","2026-08-22","batumi","tbilisi"), mk("2026-08-25","2026-08-28","tbilisi","tbilisi")], [], q("batumi","2026-08-30","batumi","2026-08-31")).ok, false);
expect("chain-bat-ok-31", isCarAvailable(car, [mk("2026-08-20","2026-08-22","batumi","tbilisi"), mk("2026-08-25","2026-08-28","tbilisi","tbilisi")], [], q("batumi","2026-08-31","batumi","2026-09-01")).ok, true);

console.log(`\n${pass} passed, ${fail} failed`);
