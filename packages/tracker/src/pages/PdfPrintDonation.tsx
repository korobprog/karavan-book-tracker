import { Document, Page, View, StyleSheet } from "@react-pdf/renderer";
import { Divider, QRCode, Space, Typography } from "antd";
import React from "react";
import { CurrentUser } from "common/src/services/api/useCurrentUser";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
  },
  section: {
    margin: 0,
    padding: 0,
    flexGrow: 1,
  },
});

type Props = {
  currentUser: CurrentUser;
};
const { Text } = Typography;
// Create Document Component
export const PdfPrintDonation = (props: Props) => {
  const { currentUser } = props;

  const userId = currentUser.profile?.id || currentUser.user?.uid;

  const myPageLink = `https://books-donation.web.app/page/${userId}`;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Space direction="vertical" align="center" style={{ padding: 5 }}>
            <Text strong>Donation for books</Text>
            <QRCode
              className="centred"
              value={myPageLink}
              bgColor="#fff"
              style={{ marginBottom: 16 }}
            />
          </Space>
        </View>

        <View style={styles.section}>
          <Space direction="vertical" align="center" style={{ padding: 5 }}>
            <Text strong>Donation for books</Text>
            <QRCode
              className="centred"
              value={myPageLink}
              bgColor="#fff"
              style={{ marginBottom: 16 }}
            />
          </Space>
        </View>

        <View style={styles.section}>
          <Space direction="vertical" align="center" style={{ padding: 5 }}>
            <Text strong>Donation for books</Text>
            <QRCode
              className="centred"
              value={myPageLink}
              bgColor="#fff"
              style={{ marginBottom: 16 }}
            />
          </Space>
        </View>

        <View style={styles.section}>
          <Space direction="vertical" align="center" style={{ padding: 5 }}>
            <Text strong>Donation for books</Text>
            <QRCode
              className="centred"
              value={myPageLink}
              bgColor="#fff"
              style={{ marginBottom: 16 }}
            />
          </Space>
        </View>
        <Divider dashed />
        <View style={styles.section}>
          <Space direction="vertical" align="center" style={{ padding: 5 }}>
            <Text strong>Donation for books</Text>
            <QRCode
              className="centred"
              value={myPageLink}
              bgColor="#fff"
              style={{ marginBottom: 16 }}
            />
          </Space>
        </View>
        <View style={styles.section}>
          <Space direction="vertical" align="center" style={{ padding: 5 }}>
            <Text strong>Donation for books</Text>
            <QRCode
              className="centred"
              value={myPageLink}
              bgColor="#fff"
              style={{ marginBottom: 16 }}
            />
          </Space>
        </View>
        <View style={styles.section}>
          <Space direction="vertical" align="center" style={{ padding: 5 }}>
            <Text strong>Donation for books</Text>
            <QRCode
              className="centred"
              value={myPageLink}
              bgColor="#fff"
              style={{ marginBottom: 16 }}
            />
          </Space>
        </View>
        <View style={styles.section}>
          <Space direction="vertical" align="center" style={{ padding: 5 }}>
            <Text strong>Donation for books</Text>
            <QRCode
              className="centred"
              value={myPageLink}
              bgColor="#fff"
              style={{ marginBottom: 16 }}
            />
          </Space>
        </View>
        <Divider dashed />
        <View style={styles.section}>
          <Space direction="vertical" align="center" style={{ padding: 5 }}>
            <Text strong>Donation for books</Text>
            <QRCode
              className="centred"
              value={myPageLink}
              bgColor="#fff"
              style={{ marginBottom: 16 }}
            />
          </Space>
        </View>
        <View style={styles.section}>
          <Space direction="vertical" align="center" style={{ padding: 5 }}>
            <Text strong>Donation for books</Text>
            <QRCode
              className="centred"
              value={myPageLink}
              bgColor="#fff"
              style={{ marginBottom: 16 }}
            />
          </Space>
        </View>
        <View style={styles.section}>
          <Space direction="vertical" align="center" style={{ padding: 5 }}>
            <Text strong>Donation for books</Text>
            <QRCode
              className="centred"
              value={myPageLink}
              bgColor="#fff"
              style={{ marginBottom: 16 }}
            />
          </Space>
        </View>
        <View style={styles.section}>
          <Space direction="vertical" align="center" style={{ padding: 5 }}>
            <Text strong>Donation for books</Text>
            <QRCode
              className="centred"
              value={myPageLink}
              bgColor="#fff"
              style={{ marginBottom: 16 }}
            />
          </Space>
        </View>
        <Divider dashed />
        <View style={styles.section}>
          <Space direction="vertical" align="center" style={{ padding: 5 }}>
            <Text strong>Donation for books</Text>
            <QRCode
              className="centred"
              value={myPageLink}
              bgColor="#fff"
              style={{ marginBottom: 16 }}
            />
          </Space>
        </View>
        <View style={styles.section}>
          <Space direction="vertical" align="center" style={{ padding: 5 }}>
            <Text strong>Donation for books</Text>
            <QRCode
              className="centred"
              value={myPageLink}
              bgColor="#fff"
              style={{ marginBottom: 16 }}
            />
          </Space>
        </View>
        <View style={styles.section}>
          <Space direction="vertical" align="center" style={{ padding: 5 }}>
            <Text strong>Donation for books</Text>
            <QRCode
              className="centred"
              value={myPageLink}
              bgColor="#fff"
              style={{ marginBottom: 16 }}
            />
          </Space>
        </View>
        <View style={styles.section}>
          <Space direction="vertical" align="center" style={{ padding: 5 }}>
            <Text strong>Donation for books</Text>
            <QRCode
              className="centred"
              value={myPageLink}
              bgColor="#fff"
              style={{ marginBottom: 16 }}
            />
          </Space>
        </View>
      </Page>
    </Document>
  );
};
