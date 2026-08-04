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
  {
    id: "MEDSAFE-002",
    title: "Metformin management before intravenous iodinated contrast in stable CKD",
    subjectArea: "Medication Safety",
    verificationStatus: "VERIFIED",
    version: 1,
    evaluationCriteria: [],
    prompt: `Assume today is August 4, 2026. A 62-year-old outpatient with type 2 diabetes takes metformin 500 mg twice daily. The patient has stable chronic kidney disease with an eGFR of 44 mL/min/1.73 m² measured yesterday; prior eGFR values have been stable in the low-to-mid 40s. There is no evidence of acute kidney injury. The patient has no history of hepatic impairment, alcoholism, or heart failure.

The patient is scheduled for a contrast-enhanced CT of the abdomen using intravenous iodinated contrast. This is not an intra-arterial study.

A radiology clinician states that metformin does not need to be stopped because the patient has no AKI and the eGFR is at least 30 mL/min/1.73 m². A pharmacist responds that current U.S. metformin labeling requires metformin to be withheld because the patient's eGFR is between 30 and 60 mL/min/1.73 m².

Analyze:

1. Whether the radiology clinician's statement is consistent with the current American College of Radiology recommendation.
2. Whether the pharmacist's statement is consistent with current U.S. metformin prescribing information.
3. Whether these recommendations actually conflict, and how that disagreement should be communicated rather than presenting one recommendation as universally controlling.
4. Whether metformin itself increases the patient's risk of contrast-associated acute kidney injury.
5. What safety concern underlies recommendations to withhold metformin around iodinated contrast.
6. If the institution elects to follow the current U.S. prescribing information, when metformin should be stopped, what follow-up is required, and when it may be restarted.

Distinguish intravenous from intra-arterial iodinated contrast. Cite the current FDA-approved prescribing information and the current ACR Manual on Contrast Media. Do not rely only on general clinical practice or an uncited summary.`,
    referenceNotes: `Core judgment: Both clinicians are accurately describing different authoritative recommendations. The response should not erase that disagreement.

ACR recommendation

Under the 2026 ACR Manual on Contrast Media, this patient falls into Category I because the patient has no evidence of acute kidney injury, has an eGFR of 44 mL/min/1.73 m², and is receiving intravenous rather than the relevant arterial-catheter iodinated contrast exposure.

Under that ACR recommendation:

- metformin does not need to be discontinued before the IV contrast study;
- metformin does not need to be withheld afterward solely because of the IV contrast exposure; and
- obligatory post-procedure renal-function reassessment is not required solely for metformin management.

Therefore, the radiology clinician's statement is consistent with current ACR guidance.

U.S. prescribing information

Current U.S. metformin prescribing information is more restrictive.

For an iodinated contrast imaging procedure, the labeling instructs metformin to be discontinued at the time of or before the procedure when the patient's eGFR is between 30 and 60 mL/min/1.73 m².

Because this patient's eGFR is 44, that criterion applies.

The labeling further instructs clinicians to:

- re-evaluate eGFR 48 hours after the imaging procedure; and
- restart metformin if renal function is stable.

Therefore, the pharmacist's statement is also consistent with current U.S. prescribing information.

The sources genuinely differ

A response should not say simply that “metformin must be held” without identifying the source, nor should it say that “current guidelines say metformin can always be continued.”

The accurate analysis is:

- FDA-approved prescribing information: hold in this patient because eGFR is 30–60.
- ACR 2026: continuation is acceptable for this IV study because there is no AKI and eGFR is ≥30.

The ACR Manual expressly recognizes that FDA labeling is more restrictive than the ACR recommendation.

This is therefore a source-dependent clinical-management disagreement, not evidence that one clinician necessarily misunderstood the underlying eGFR value.

Metformin and acute kidney injury

Metformin itself should not be characterized as increasing the risk of contrast-associated or contrast-induced acute kidney injury.

The safety concern is downstream: if clinically important acute kidney injury occurs, impaired renal clearance can promote metformin accumulation and increase the risk of metformin-associated lactic acidosis.

A strong answer should distinguish:

contrast exposure → possible renal injury → impaired metformin clearance → increased lactic-acidosis risk

from the incorrect claim:

metformin → increased contrast nephrotoxicity

The response should also distinguish contrast-associated acute kidney injury from contrast-induced acute kidney injury rather than treating association with contrast exposure as proof that contrast caused the kidney injury.

If the institution follows U.S. labeling

For this specific patient:

1. Withhold metformin at the time of or before the iodinated contrast procedure.
2. Re-evaluate eGFR 48 hours after the procedure.
3. Restart metformin if renal function is stable.

The prescribing information does not establish an additional numerical creatinine-change threshold for defining “stable” renal function in this instruction.

A response should not invent a criterion such as a less-than-25-percent creatinine increase and present it as though it were part of the FDA-approved labeling.

The response should not substitute the ACR pathway while simultaneously claiming to be following the FDA-approved label.

Intravenous versus intra-arterial contrast

The prompt deliberately limits the case to intravenous iodinated contrast.

Current U.S. metformin prescribing information separately identifies intra-arterial iodinated contrast administration as a reason to discontinue metformin.

The ACR Category II recommendation is narrower than a blanket rule applying to every intra-arterial procedure. It includes arterial catheter studies that might result in emboli to the renal arteries.

A response should therefore not collapse:

- ordinary intravenous iodinated contrast;
- all intra-arterial contrast procedures; and
- the narrower ACR arterial-catheter Category II circumstance

into one rule.

The route of administration should also not be used to make unsupported claims that intravenous contrast is inherently lower-osmolality or that intra-arterial administration is inherently a “high-osmolar” exposure. Route and contrast-medium osmolality are separate concepts.

Controlling primary authorities

The case was personally verified against:

- 2026 ACR Manual on Contrast Media
- current U.S. FDA-approved metformin prescribing information

Important ACR principles to preserve:

- no evidence of AKI + eGFR ≥30 mL/min/1.73 m² + ordinary IV iodinated contrast falls under the less restrictive Category I recommendation;
- metformin does not need to be discontinued solely for that IV exposure;
- obligatory post-procedure renal-function reassessment is not required under that ACR pathway;
- patients taking metformin are not considered at increased risk of contrast-induced acute kidney injury solely because they take metformin;
- ACR recognizes that current FDA labeling is more restrictive;
- Category II includes acute kidney injury, severe chronic kidney disease with eGFR below 30 mL/min/1.73 m², and relevant arterial catheter studies that might result in emboli to the renal arteries.

Important U.S. prescribing-information principles to preserve:

- eGFR 30–60 mL/min/1.73 m² is a criterion for discontinuing metformin at or before iodinated contrast imaging;
- intra-arterial iodinated contrast administration is separately included;
- eGFR is re-evaluated 48 hours after the imaging procedure;
- metformin may be restarted if renal function is stable;
- the labeling does not provide a less-than-25-percent creatinine-increase restart rule.`,
  },
];
