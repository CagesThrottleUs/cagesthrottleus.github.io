import { CVEntry } from '../../CVEntry';

export default function November2024() {
  return (
    <>
      <CVEntry tooltip="Kernel-level and similar tickets were incorrectly routed to non-owner teams; paginated API + UI corrected routing">
        Built vulnerability ticket routing UI and paginated API
      </CVEntry>
      <CVEntry tooltip="Reduced onboarding from 2 weeks of manual work to 5 minutes of automation">
        Created full EKS onboarding automation for closely related EKS flavors
      </CVEntry>
    </>
  );
}
