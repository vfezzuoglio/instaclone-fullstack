import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import ScreenWrapper from "../../../components/ui/ScreenWrapper";
import AppInput from "../../../components/ui/AppInput";
import AppButton from "../../../components/ui/AppButton";
import { useApp } from "../../../context/AppContext";
import { uploadImage } from "../../../services/api";

export default function CreateScreen() {
  const { createPost, token } = useApp();
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow access to your photo library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.85,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    setImage(result.assets[0]);
  };

  const onCreate = async () => {
    if (submitting) return;

    if (!image) {
      Alert.alert("Missing image", "Pick a photo before posting.");
      return;
    }

    setSubmitting(true);
    try {
      const uploaded = await uploadImage(image, { token });
      await createPost({ imageUrl: uploaded.imageUrl, caption });
      setImage(null);
      setCaption("");
      router.replace("/(tabs)/home");
    } catch (error) {
      Alert.alert("Post failed", error.message || "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
        <View style={{ gap: 16 }}>
        <View style={{ gap: 12 }}>
          <Pressable
            onPress={pickImage}
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderStyle: "dashed",
              borderColor: "#D1D5DB",
              paddingVertical: 18,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#F9FAFB",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827" }}>
              {image ? "Change photo" : "Choose a photo"}
            </Text>
            <Text style={{ marginTop: 6, fontSize: 13, color: "#6B7280" }}>
              Select an image from your device
            </Text>
          </Pressable>

          {image ? (
            <View style={{ borderRadius: 18, overflow: "hidden", backgroundColor: "#111827" }}>
              <Image
                source={{ uri: image.uri }}
                style={{ width: "100%", aspectRatio: 1, backgroundColor: "#E5E7EB" }}
              />
            </View>
          ) : null}
        </View>

        <AppInput
          label="Caption"
          value={caption}
          onChangeText={setCaption}
          placeholder="Write a caption"
          autoCapitalize="sentences"
          multiline
        />

        <AppButton
          title={submitting ? "Uploading..." : "Create Post"}
          onPress={onCreate}
        />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}