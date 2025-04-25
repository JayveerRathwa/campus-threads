import {
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    useColorModeValue,
    Spinner,
  } from "@chakra-ui/react";
  import { useEffect, useState } from "react";
  import debounce from "lodash.debounce";
  
  const UniversityAutoComplete = ({
    label = "University",
    value,
    onChange,
    isRequired,
    setIsValid, 
  }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
  
    const fetchUniversities = debounce(async (query) => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await fetch(`/universities?name=${query}`);
        const data = await res.json();
        const names = [...new Set(data.map((uni) => uni.name))];
        setSuggestions(names);
        setShowSuggestions(true);
  
        if (setIsValid) {
          setIsValid(names.includes(query));
        }
      } catch (err) {
        console.error("Failed to fetch universities", err);
      } finally {
        setLoading(false);
      }
    }, 300);
  
    useEffect(() => {
      return () => {
        fetchUniversities.cancel();
      };
    }, []);
  
    const handleInputChange = (input) => {
      onChange(input);
      if (input.length > 1) {
        fetchUniversities(input);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        if (setIsValid) setIsValid(false);
      }
  
      if (setIsValid) {
        setIsValid(suggestions.includes(input));
      }
    };
  
    return (
      <FormControl isRequired={isRequired} position="relative">
        <FormLabel>{label}</FormLabel>
        <InputGroup>
          <Input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              if (value) setShowSuggestions(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 100); // allow click
            }}
          />
          {loading && (
            <Spinner size="sm" position="absolute" right="10px" top="10px" color="gray.500" />
          )}
        </InputGroup>
  
        {showSuggestions && (
          <Box
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            mt={1}
            maxH="150px"
            overflowY="auto"
            bg={useColorModeValue("white", "gray.700")}
            zIndex={2}
            position="absolute"
            w="100%"
          >
            {suggestions.length > 0 ? (
              suggestions.map((uni, idx) => (
                <Box
                  key={idx}
                  px={4}
                  py={2}
                  _hover={{ bg: useColorModeValue("gray.100", "gray.600"), cursor: "pointer" }}
                  onClick={() => {
                    onChange(uni);
                    if (setIsValid) setIsValid(true);
                    setShowSuggestions(false);
                  }}
                >
                  {uni}
                </Box>
              ))
            ) : (
              <Box px={4} py={2} color="gray.500">
                No results found
              </Box>
            )}
          </Box>
        )}
      </FormControl>
    );
  };
  
  export default UniversityAutoComplete;
  