import { Slot } from "expo-router";
import { Text, View } from "react-native";

export default function CreateLayout() {
    return (
        <View style={{ flex: 1, maxWidth: 600, width: "100%", alignSelf: "center" }}>
            <View
                style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#DBDBDB",
                    paddingHorizontal: 24,
                    paddingTop: 24,
                    paddingBottom: 16,
                    marginBottom: 8,
                }}
            >
                <Text style={{ fontSize: 24, fontWeight: "800", color: "#111827" }}>
                    Create Post
                </Text>
            </View>

            <View style={{ flex: 1 }}>
                <Slot />
            </View>
        </View>
    );
}