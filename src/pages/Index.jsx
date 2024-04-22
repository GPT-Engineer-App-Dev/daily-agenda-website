import { useState } from "react";
import { Box, Button, Flex, Heading, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, VStack, Input, useToast } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const Index = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventText, setEventText] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const days = [];
  for (let day = new Date(startOfMonth); day <= endOfMonth; day.setDate(day.getDate() + 1)) {
    days.push(new Date(day));
  }

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setEventText(events[day.toISOString().split("T")[0]] || "");
    onOpen();
  };

  const saveEvent = () => {
    setEvents({
      ...events,
      [selectedDate.toISOString().split("T")[0]]: eventText,
    });
    onClose();
    toast({
      title: "Event saved",
      description: "Your event has been successfully saved.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const deleteEvent = () => {
    const newEvents = { ...events };
    delete newEvents[selectedDate.toISOString().split("T")[0]];
    setEvents(newEvents);
    onClose();
    toast({
      title: "Event deleted",
      description: "Your event has been successfully deleted.",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box p={5}>
      <Flex justifyContent="space-between" alignItems="center" mb={5}>
        <Heading>Calendar</Heading>
        <Button
          leftIcon={<FaPlus />}
          onClick={() => {
            setSelectedDate(new Date());
            setEventText("");
            onOpen();
          }}
        >
          Add Event
        </Button>
      </Flex>
      <VStack spacing={3}>
        {days.map((day) => (
          <Flex key={day} justifyContent="space-between" alignItems="center" w="100%" p={2} borderWidth="1px">
            <Text>{day.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</Text>
            <Flex>
              <Text pr={2}>{events[day.toISOString().split("T")[0]]}</Text>
              <IconButton icon={<FaEdit />} onClick={() => handleDayClick(day)} />
              <IconButton
                icon={<FaTrash />}
                onClick={() => {
                  setSelectedDate(day);
                  deleteEvent();
                }}
              />
            </Flex>
          </Flex>
        ))}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedDate ? selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }) : "New Event"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input placeholder="Enter event details" value={eventText} onChange={(e) => setEventText(e.target.value)} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={saveEvent}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Index;
