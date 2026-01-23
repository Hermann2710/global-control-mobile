export const createImageFormData = (
  uri: string,
  fieldName = "image"
): FormData => {
  const formData = new FormData();

  formData.append(fieldName, {
    uri,
    name: `image-${Date.now()}.jpg`,
    type: "image/jpeg",
  } as any);

  return formData;
};
