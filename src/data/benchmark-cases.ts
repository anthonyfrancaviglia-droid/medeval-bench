import type { BenchmarkCase } from "@/lib/types";

// Only benchmark cases personally verified by the project owner belong here.
export const benchmarkCases: readonly BenchmarkCase[] = [
  {
    id: "MEDSAFE-001",
    title: "Schedule II electronic prescription transfer in New York",
    subjectArea: "Medication Safety",
    verificationStatus: "VERIFIED",
    version: 1,
    evaluationCriteria: [],
    prompt: `Assume today is July 22, 2026. I am assisting the supervising pharmacist at a New York community retail pharmacy. A patient asks us to transfer an unfilled electronic prescription for oxycodone 5 mg tablets, a Schedule II controlled substance, to another New York retail pharmacy because our pharmacy has no stock. Both pharmacies are licensed in New York and registered with the DEA, the prescription has never been filled or partially filled, the patient expressly authorized the transfer, and both pharmacies’ software systems can electronically transfer controlled-substance prescriptions.

A New York-registered pharmacy technician calls the receiving pharmacist and verbally reads all of the prescription information. The pharmacist at the sending pharmacy listens to the call, approves what the technician says, and then marks the prescription as transferred in the computer. The receiving pharmacist intends to dispense the medication based on that communication.

Analyze:

Whether the Schedule II prescription itself was legally eligible to be transferred.
Whether communicating the transfer verbally was legally valid.
Whether the registered pharmacy technician could perform the transfer because the pharmacist directly supervised and approved the communication.
What corrective action must occur before the receiving pharmacy may lawfully dispense the prescription.

Apply federal law and New York law in effect on July 22, 2026. Distinguish between whether the prescription was eligible for transfer and whether the staff used a legally permissible transfer procedure. Cite the controlling statutes or regulations and do not rely only on general pharmacy practice.`,
    referenceNotes: `Eligible prescription, defective transfer procedure.

1. Transfer eligibility

Under 21 C.F.R. § 1306.08(e)-(g), an electronic prescription for a Schedule II-V controlled substance may be transferred one time between retail pharmacies for initial dispensing at the patient's request when state law permits the transfer.

New York permitted controlled-substance prescription transfers on July 22, 2026. The applicable New York framework includes 8 NYCRR § 63.6(a)(8), Article 33 of the Public Health Law, 10 NYCRR Part 80, and Public Health Law § 281(3-a).

On the stated facts, the prescription itself was eligible for transfer because it was electronic, had never been filled or partially filled, the patient requested the transfer, and the pharmacies satisfied the stated licensing/DEA-registration conditions.

2. Verbal communication

The legally important distinction is between the prescription itself and communication between the pharmacists.

Under 21 C.F.R. § 1306.08(f), the electronic controlled-substance prescription itself must remain electronic and be transferred electronically between the pharmacies. A verbal readout of prescription information cannot substitute for transmission of the original electronic prescription.

DEA does not require the direct pharmacist-to-pharmacist communication associated with the transfer to occur through a particular communication medium. Oral pharmacist-to-pharmacist communication may therefore accompany a lawful electronic transfer.

Accordingly, it is too broad to say that any verbal communication concerning a Schedule II transfer is inherently prohibited. The defect in this scenario is that the prescription itself was not electronically transferred and the required direct pharmacist-to-pharmacist transfer communication did not occur.

3. Pharmacy technician

21 C.F.R. § 1306.08(f)(3) requires direct communication between the persons legally authorized as pharmacists for purposes of the transfer.

New York's prescription-transfer rule, 8 NYCRR § 63.6(a)(8), likewise requires the original prescription information to be transferred directly from one pharmacist to another pharmacist.

A New York registered pharmacy technician may perform authorized technical functions under pharmacist supervision, but supervision does not allow the technician to substitute for the pharmacist in a function that the transfer rule specifically assigns to pharmacists.

The sending pharmacist merely listening to the technician's telephone communication and approving it does not convert the technician's statements into direct pharmacist-to-pharmacist transfer communication.

Therefore the scenario contains two separate procedural defects:

- the electronic prescription itself was not electronically transferred; and
- the legally required direct pharmacist-to-pharmacist transfer communication did not occur.

4. Corrective action

The receiving pharmacy may not lawfully dispense based solely on the technician's verbal readout and resulting manually entered prescription information.

Before dispensing, a compliant transfer must be completed under 21 C.F.R. § 1306.08, including:

- actual electronic transmission of the original EPCS between the pharmacies;
- direct pharmacist-to-pharmacist transfer communication;
- preservation of the prescription contents without alteration; and
- completion of the sending and receiving pharmacy transfer records required by the regulation.

The sending pharmacy must appropriately correct the erroneous status created by prematurely marking the prescription as transferred while preserving the required audit/history information.

If the original electronic prescription can still lawfully undergo its permitted transfer after that correction, the pharmacies may complete the compliant transfer.

If the prescription record or software state prevents a lawful transfer of the original prescription, the receiving pharmacy may not improvise around the defective record; a new valid electronic prescription from the prescriber would be necessary before dispensing.

For this New York Schedule II prescription, do not apply a six-month Schedule III-IV refill rule. New York's Schedule II timing requirements include the applicable 30-day requirement under Public Health Law § 3333 and 10 NYCRR § 80.73.

CONTROLLING / IMPORTANT AUTHORITIES TO PRESERVE IN THE REFERENCE NOTES

Federal:
- 21 C.F.R. § 1306.08(e)-(h)

New York:
- 8 NYCRR § 63.6(a)(8)
- New York Public Health Law § 281(3-a)
- New York Public Health Law § 3333
- 10 NYCRR Part 80, including § 80.73 where applicable`,
  },
];
