import { useState } from "react";
import { Alert, View } from "react-native";
import { router } from "expo-router";
import ScreenWrapper from "../../../components/ui/ScreenWrapper";
import AppInput from "../../../components/ui/AppInput";
import AppButton from "../../../components/ui/AppButton";
import { useApp } from "../../../context/AppContext";

export default function CreateScreen() {
  const { createPost } = useApp();
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onCreate = async () => {
    if (submitting) return;

    setSubmitting(true);
    try {
      await createPost({ image, caption });
      setImage("");
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
      <View style={{ gap: 16 }}>
        <AppInput
          label="Image URL"
          value={image}
          onChangeText={setImage}
          placeholder="Paste an image URL"
        />

        <AppInput
          label="Caption"
          value={caption}
          onChangeText={setCaption}
          placeholder="Write a caption"
          autoCapitalize="sentences"
          multiline
        />

        <AppButton
          title={submitting ? "Creating..." : "Create Post"}
          onPress={onCreate}
        />
      </View>
    </ScreenWrapper>
  );
}