import { sectionMeta, sectionPage } from "../../../../components/section-page";

export const generateStaticParams = sectionMeta("upgrading").generateStaticParams;
export const generateMetadata = sectionMeta("upgrading").generateMetadata;

export default sectionPage("upgrading");
