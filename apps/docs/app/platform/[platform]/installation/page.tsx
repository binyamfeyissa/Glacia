import { sectionMeta, sectionPage } from "../../../../components/section-page";

export const generateStaticParams = sectionMeta("installation").generateStaticParams;
export const generateMetadata = sectionMeta("installation").generateMetadata;

export default sectionPage("installation");
