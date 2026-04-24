import { useRef, useState, type ChangeEvent } from "react"

const MAX_SIZE_BYTES = 2 * 1024 * 1024

const readAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

type UseImagePickerReturn = {
  inputRef: React.RefObject<HTMLInputElement | null>
  error: string | null
  handleOpenPicker: () => void
  handleChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>
}

export const useImagePicker = (
  onPick: (dataUrl: string) => void,
): UseImagePickerReturn => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleOpenPicker = () => inputRef.current?.click()

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("Select an image file")
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError("Image must be under 2MB")
      return
    }
    const dataUrl = await readAsDataUrl(file)
    setError(null)
    onPick(dataUrl)
  }

  return { inputRef, error, handleOpenPicker, handleChange }
}
