import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 20,
  },
  container: {
    width: "100%",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
    paddingBottom: 30,
    border: "2px solid #000",
    margin: 10,
    borderRadius: 5,
  },
  heading: {
    fontSize: 90,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Helvetica-Bold",
  },
  image: {
    width: 500,
    height: "auto",
    marginVertical: 20,
  },
  subheading: {
    fontSize: 90,
    fontWeight: "bold",
    marginTop: 20,
    fontFamily: "Helvetica-Bold",
  },
});

export default styles;
