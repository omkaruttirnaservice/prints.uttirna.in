import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import styles from "../styles/welcomePageStyles";

const WelcomePage = ({ imageSrc }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.heading}>WELCOME TO</Text>
        {imageSrc && <Image src={imageSrc || "/placeholder.svg"} style={styles.image} />}
        <Text style={styles.subheading}>EXAM</Text>
      </View>
    </Page>
  </Document>
);

export default WelcomePage;
