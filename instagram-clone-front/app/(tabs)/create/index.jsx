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

  const onCreate = () => {
    const ok = createPost({ image, caption });

    if (!ok) {
      Alert.alert("Post failed", "Please add an image URL.");
      return;
    }

    setImage("");
    setCaption("");
    router.replace("/(tabs)/home");
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

        <AppButton title="Create Post" onPress={onCreate} />
      </View>
    </ScreenWrapper>
  );
}