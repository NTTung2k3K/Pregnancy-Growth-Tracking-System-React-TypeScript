import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const vietnameseNames = {
  male: {
    happiness: ["Phúc", "Hạnh", "Vui", "An"],
    strength: ["Dũng", "Lực", "Cường", "Khỏe"],
    intelligence: ["Minh", "Tuệ", "Trí", "Tài"],
    nature: ["Lâm", "Hà", "Hải", "Phong"],
    prosperity: ["Quang", "Phát", "Lộc", "Tài"],
    courage: ["Anh", "Dũng", "Quyết", "Kiên"],
    wisdom: ["Trí", "Minh", "Tuệ", "Thông"],
    leadership: ["Khánh", "Quang", "Sơn", "Vũ"],
    loyalty: ["Trung", "Nghĩa", "Tín", "Chính"],
    resilience: ["Bình", "Kiên", "Chí", "Nhẫn"],
    success: ["Thành", "Đạt", "Hưng", "Tiến"],
    ambition: ["Hoài", "Khát", "Ước", "Mộng"],
  },
  female: {
    happiness: ["An", "Diễm", "Kim", "Lan"],
    beauty: ["Diễm", "Cẩm", "Trang", "Kim"],
    kindness: ["Tâm", "Thiện", "Hiền", "Hòa"],
    courage: ["Anh", "Dũng", "Quyết", "Kiên"],
    wisdom: ["Trí", "Minh", "Tuệ", "Thông"],
    love: ["Tình", "Ái", "Duyên", "Hạnh"],
    peace: ["An", "Hòa", "Yên", "Tĩnh"],
    creativity: ["Phong", "Hải", "Sáng", "Thiên"],
    nobility: ["Quý", "Thanh", "Phong", "Trọng"],
    harmony: ["Thuận", "Hòa", "Tịnh", "An"],
    resilience: ["Bình", "Kiên", "Chí", "Nhẫn"],
    success: ["Thành", "Đạt", "Hưng", "Tiến"],
  },
};

type Gender = "male" | "female";

type NameGeneratorProps = {};

const VietnameseNameGenerator: React.FC<NameGeneratorProps> = () => {
  const [gender, setGender] = useState<Gender>("male");
  const [startingLetter, setStartingLetter] = useState("");
  const [meaning, setMeaning] = useState("");
  const [generatedName, setGeneratedName] = useState("");
  const [suggestedLetters, setSuggestedLetters] = useState<string[]>([]);

  useEffect(() => {
    if (meaning) {
      const namePool =
        vietnameseNames[gender][
          meaning as keyof (typeof vietnameseNames)[Gender]
        ] || [];
      const letters = Array.from(
        new Set(namePool.map((name) => name.charAt(0).toUpperCase()))
      ); // Unique starting letters
      setSuggestedLetters(letters);
    } else {
      setSuggestedLetters([]);
    }
  }, [meaning, gender]);

  const generateName = () => {
    let namePool =
      vietnameseNames[gender][
        meaning as keyof (typeof vietnameseNames)[Gender]
      ] || [];

    if (startingLetter) {
      namePool = namePool.filter((name) =>
        name.toLowerCase().startsWith(startingLetter.toLowerCase())
      );
    }

    if (namePool.length === 0) {
      setGeneratedName("No matching name found.");
      return;
    }

    const randomName = namePool[Math.floor(Math.random() * namePool.length)];
    setGeneratedName(randomName);
  };

  return (
    <div className="flex items-center justify-center my-20 text-sky-800">
      <div className="p-4 border rounded-lg w-80 space-y-4">
        <h2 className="text-lg font-semibold">Vietnamese Name Generator</h2>
        <Select
          value={gender}
          onValueChange={(value) => setGender(value as Gender)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Starts with..."
          value={startingLetter}
          onChange={(e) => setStartingLetter(e.target.value)}
        />
        <Select value={meaning} onValueChange={(value) => setMeaning(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Meaning" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(vietnameseNames[gender]).map((key) => (
              <SelectItem key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Suggested starting letters */}
        {suggestedLetters.length > 0 && (
          <div className="mt-2 border-b pb-4">
            <strong>Suggested Starting Letters:</strong>
            <div className="flex space-x-2">
              {suggestedLetters.map((letter) => (
                <Button
                  key={letter}
                  className="bg-sky-900 text-emerald-400"
                  onClick={() => setStartingLetter(letter)}
                >
                  {letter}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Button
          className="bg-sky-900 text-emerald-400 hover:bg-sky-900"
          onClick={generateName}
        >
          Generate Name
        </Button>
        {generatedName && (
          <p className="text-center font-medium">
            Generated Name: {generatedName}
          </p>
        )}
      </div>
    </div>
  );
};

export default VietnameseNameGenerator;
