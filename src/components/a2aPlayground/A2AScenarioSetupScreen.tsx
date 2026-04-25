'use client';

import React, { useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  A2AScenarioConfig,
  A2AScenarioSetupProps,
  DemoUserIdentifiers,
  ScenarioOperations,
  DEMO_RELYING_PARTIES,
  DEFAULT_SCENARIO_CONFIG,
} from '../../types/a2aPlayground';

const COUNTRY_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'IN', label: 'India' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AE', label: 'UAE' },
  { value: 'SG', label: 'Singapore' },
];

const PHONE_CODES = [
  { value: '+1', label: '+1 (US)' },
  { value: '+91', label: '+91 (IN)' },
  { value: '+44', label: '+44 (UK)' },
  { value: '+971', label: '+971 (UAE)' },
  { value: '+65', label: '+65 (SG)' },
];

export const A2AScenarioSetupScreen: React.FC<A2AScenarioSetupProps> = ({
  onRunScenario,
}) => {
  const [selectedPartyId, setSelectedPartyId] = useState(
    DEFAULT_SCENARIO_CONFIG.relyingParty.id
  );
  const [user, setUser] = useState<DemoUserIdentifiers>(
    DEFAULT_SCENARIO_CONFIG.user
  );
  const [operations, setOperations] = useState<ScenarioOperations>(
    DEFAULT_SCENARIO_CONFIG.operations
  );

  const selectedParty =
    DEMO_RELYING_PARTIES.find((party) => party.id === selectedPartyId) ||
    DEMO_RELYING_PARTIES[0];

  const handleRun = () => {
    const config: A2AScenarioConfig = {
      relyingParty: selectedParty,
      user,
      operations,
    };
    onRunScenario(config);
  };

  const hasOperation =
    operations.verifyKycStatus ||
    operations.confirmKeyMatch ||
    operations.exportKycProfile;

  return (
    <Box minH="100vh" bg="white" py={{ base: 6, md: 8, lg: 10 }}>
      <Container maxW="7xl" px={{ base: 4, md: 8, lg: 12 }}>
        <VStack spacing={3} mb={{ base: 8, md: 10 }} textAlign="center">
          <Badge
            colorScheme="purple"
            px={3}
            py={1}
            borderRadius="full"
            fontSize="xs"
          >
            A2A PROTOCOL DEMO
          </Badge>
          <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="600" color="black">
            Agent-to-Agent KYC Playground
          </Text>
          <Text color="gray.600" fontSize={{ base: 'sm', md: 'md' }} maxW="2xl">
            Watch Bank KYC Copilot and Hushh KYC Agent collaborate in real-time
            to verify identity and export KYC data.
          </Text>
        </VStack>

        <Box
          bg="gray.50"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="2xl"
          p={{ base: 4, md: 6, lg: 8 }}
          boxShadow="sm"
        >
          <VStack spacing={{ base: 6, md: 8 }} align="stretch">
            <Box>
              <Text
                fontSize="sm"
                fontWeight="600"
                color="purple.600"
                mb={3}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                1. Choose Relying Party
              </Text>

              <FormControl>
                <FormLabel color="gray.700" fontSize="sm">
                  Bank or Financial Institution
                </FormLabel>
                <Select
                  value={selectedPartyId}
                  onChange={(event) => setSelectedPartyId(event.target.value)}
                  bg="white"
                  border="1px solid"
                  borderColor="gray.300"
                  color="black"
                  _hover={{ borderColor: 'purple.500' }}
                  _focus={{
                    borderColor: 'purple.500',
                    boxShadow: '0 0 0 1px #805AD5',
                  }}
                >
                  {DEMO_RELYING_PARTIES.map((party) => (
                    <option key={party.id} value={party.id}>
                      {party.name}
                      {party.description ? ` - ${party.description}` : ''}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Divider borderColor="gray.200" />

            <Box>
              <Text
                fontSize="sm"
                fontWeight="600"
                color="purple.600"
                mb={3}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                2. User to Verify
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 5, lg: 6 }}>
                <FormControl gridColumn={{ md: 'span 2' }}>
                  <FormLabel color="gray.700" fontSize="sm">
                    Full Name
                  </FormLabel>
                  <Input
                    value={user.fullName}
                    onChange={(event) =>
                      setUser({ ...user, fullName: event.target.value })
                    }
                    placeholder="Enter full name"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.300"
                    color="black"
                    _placeholder={{ color: 'gray.400' }}
                    _hover={{ borderColor: 'purple.500' }}
                    _focus={{
                      borderColor: 'purple.500',
                      boxShadow: '0 0 0 1px #805AD5',
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color="gray.700" fontSize="sm">
                    Phone Number
                  </FormLabel>
                  <Stack direction={{ base: 'column', sm: 'row' }} spacing={3}>
                    <Select
                      value={user.phoneCountryCode}
                      onChange={(event) =>
                        setUser({ ...user, phoneCountryCode: event.target.value })
                      }
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                      color="black"
                      w={{ base: '100%', sm: '140px' }}
                      minW={{ sm: '140px' }}
                      _hover={{ borderColor: 'purple.500' }}
                      _focus={{
                        borderColor: 'purple.500',
                        boxShadow: '0 0 0 1px #805AD5',
                      }}
                    >
                      {PHONE_CODES.map((code) => (
                        <option key={code.value} value={code.value}>
                          {code.label}
                        </option>
                      ))}
                    </Select>
                    <Input
                      value={user.phoneNumber}
                      onChange={(event) =>
                        setUser({ ...user, phoneNumber: event.target.value })
                      }
                      placeholder="Phone number"
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                      color="black"
                      _placeholder={{ color: 'gray.400' }}
                      _hover={{ borderColor: 'purple.500' }}
                      _focus={{
                        borderColor: 'purple.500',
                        boxShadow: '0 0 0 1px #805AD5',
                      }}
                    />
                  </Stack>
                </FormControl>

                <FormControl>
                  <FormLabel color="gray.700" fontSize="sm">
                    Country
                  </FormLabel>
                  <Select
                    value={user.country}
                    onChange={(event) => setUser({ ...user, country: event.target.value })}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.300"
                    color="black"
                    _hover={{ borderColor: 'purple.500' }}
                    _focus={{
                      borderColor: 'purple.500',
                      boxShadow: '0 0 0 1px #805AD5',
                    }}
                  >
                    {COUNTRY_OPTIONS.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl gridColumn={{ md: 'span 2' }}>
                  <FormLabel color="gray.700" fontSize="sm">
                    Email (Optional)
                  </FormLabel>
                  <Input
                    value={user.email || ''}
                    onChange={(event) => setUser({ ...user, email: event.target.value })}
                    placeholder="email@example.com"
                    type="email"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.300"
                    color="black"
                    _placeholder={{ color: 'gray.400' }}
                    _hover={{ borderColor: 'purple.500' }}
                    _focus={{
                      borderColor: 'purple.500',
                      boxShadow: '0 0 0 1px #805AD5',
                    }}
                  />
                </FormControl>

                {operations.confirmKeyMatch && (
                  <FormControl gridColumn={{ md: 'span 2' }}>
                    <FormLabel color="gray.700" fontSize="sm">
                      SSN Last 4 Digits (for key match demo)
                    </FormLabel>
                    <Input
                      value={user.ssnLast4 || ''}
                      onChange={(event) => setUser({ ...user, ssnLast4: event.target.value })}
                      placeholder="1234"
                      maxLength={4}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                      color="black"
                      _placeholder={{ color: 'gray.400' }}
                      _hover={{ borderColor: 'purple.500' }}
                      _focus={{
                        borderColor: 'purple.500',
                        boxShadow: '0 0 0 1px #805AD5',
                      }}
                    />
                    <Text fontSize="xs" color="gray.600" mt={1}>
                      This is only used to demo VerifyFieldMatch and is never shared in clear.
                    </Text>
                  </FormControl>
                )}
              </SimpleGrid>
            </Box>

            <Divider borderColor="gray.200" />

            <Box>
              <Text
                fontSize="sm"
                fontWeight="600"
                color="purple.600"
                mb={3}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                3. What should agents do?
              </Text>

              <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={{ base: 3, md: 4 }}>
                <Checkbox
                  isChecked={operations.verifyKycStatus}
                  onChange={(event) =>
                    setOperations({
                      ...operations,
                      verifyKycStatus: event.target.checked,
                    })
                  }
                  colorScheme="purple"
                  size="lg"
                >
                  <VStack align="start" spacing={0}>
                    <Text color="black" fontSize="sm" fontWeight="500">
                      Verify KYC Status
                    </Text>
                    <Text color="gray.600" fontSize="xs">
                      CheckKYCStatus - Is this user verified?
                    </Text>
                  </VStack>
                </Checkbox>

                <Checkbox
                  isChecked={operations.confirmKeyMatch}
                  onChange={(event) =>
                    setOperations({
                      ...operations,
                      confirmKeyMatch: event.target.checked,
                    })
                  }
                  colorScheme="purple"
                  size="lg"
                >
                  <VStack align="start" spacing={0}>
                    <Text color="black" fontSize="sm" fontWeight="500">
                      Confirm Key Match
                    </Text>
                    <Text color="gray.600" fontSize="xs">
                      VerifyFieldMatch - Does SSN last4 match?
                    </Text>
                  </VStack>
                </Checkbox>

                <Checkbox
                  isChecked={operations.exportKycProfile}
                  onChange={(event) =>
                    setOperations({
                      ...operations,
                      exportKycProfile: event.target.checked,
                    })
                  }
                  colorScheme="purple"
                  size="lg"
                >
                  <VStack align="start" spacing={0}>
                    <Text color="black" fontSize="sm" fontWeight="500">
                      Export KYC Profile
                    </Text>
                    <Text color="gray.600" fontSize="xs">
                      ExportKYCProfile - Get normalized JSON profile
                    </Text>
                  </VStack>
                </Checkbox>
              </SimpleGrid>
            </Box>

            <Divider borderColor="gray.200" />

            <Button
              size="lg"
              colorScheme="purple"
              onClick={handleRun}
              isDisabled={!user.fullName || !hasOperation}
              w="100%"
              h={{ base: '52px', md: '56px' }}
              fontSize="md"
              fontWeight="600"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(159, 122, 234, 0.4)',
              }}
              transition="all 0.2s"
            >
              Run A2A KYC Scenario
            </Button>

            <Text fontSize="xs" color="gray.600" textAlign="center" maxW="2xl" mx="auto">
              This will simulate a real A2A conversation between {selectedParty.name} and
              Hushh KYC Agent.
            </Text>
          </VStack>
        </Box>

        <Text fontSize="xs" color="gray.500" textAlign="center" mt={{ base: 6, md: 8 }}>
          A2A Protocol Demo • Hushh KYC Network • ADFW 2025
        </Text>
      </Container>
    </Box>
  );
};

export default A2AScenarioSetupScreen;
