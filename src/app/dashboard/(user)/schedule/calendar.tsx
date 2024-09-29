/** @format */

"use client";
import { useEffect, useState, useRef, use } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { useFetchEvents } from "@/app/dashboard/(user)/schedule/view-event/view_event";
import { useDragEvent } from "@/app/dashboard/(user)/schedule/drag-event/drag_event";
import { CreateEventDialog } from "@/app/dashboard/(user)/schedule/create-event/create_event";
import { EditEventDialog } from "@/app/dashboard/(user)/schedule/edit-event/edit_event";
import EventDetailsDialog from "@/app/dashboard/(user)/schedule/detail-event/detail_event";
import ChooseDragDialog from "@/components/all_confirmation_dialog/ChooseDragDialog";
import ChooseResizeDialog from "@/components/all_confirmation_dialog/ChooseResizeDialog";
import NotifyMembersDialog from "@/components/all_confirmation_dialog/NotifyMembersDialog";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Tooltip, Typography } from "@mui/material";

type EventType = {
  id: string;
  title: string;
  start: string;
  end: string;
  collabName: string;
  collabID: string;
  userID: string;
  userName: string;
  repeatGroup: string;
  repeatInterval: string;
  backgroundColor: string;
};

export default function Calendar({
  selectedGroups,
  collabs,
  onClick,
  collabArchived,
}: Readonly<{
  selectedGroups: string[];
  collabs: any;
  onClick?: boolean;
  collabArchived?: boolean;
}>) {
  const { events, fetchEvents, overlapEvents } = useFetchEvents(
    selectedGroups as any
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [currentEvent, setCurrentEvent] = useState<EventType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [showDragConfirm, setShowDragConfirm] = useState(false);
  const [showResizeConfirm, setShowResizeConfirm] = useState(false);
  const [showNotifyDialog, setShowNotifyDialog] = useState(false);
  const [updateType, setUpdateType] = useState<"current" | "all">("current");
  const { data: session } = useSession();
  const handleEventDrag = useDragEvent(fetchEvents, session);
  const pathname = usePathname();
  const isInCollab = pathname?.startsWith("/dashboard/collaboration/group");

  const handleDateSelect = (selectInfo: any) => {
    setSelectedInfo(selectInfo);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleEventClick = ({ event }: { event: any }) => {
    setCurrentEvent({
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      collabName: event.extendedProps.collabName,
      collabID: event.extendedProps.collabID,
      userID: event.extendedProps.userID,
      userName: event.extendedProps.userName,
      repeatGroup: event.extendedProps.repeatGroup,
      repeatInterval: event.extendedProps.repeatInterval,
      backgroundColor: event.backgroundColor,
    } as EventType);
    setIsDetailDialogOpen(true);
  };

  const handleEventDeletion = (deletedEventId: string) => {
    setIsDetailDialogOpen(false);
  };

  const handleEventDrop = ({ event }: { event: any }) => {
    setCurrentEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      collabID: event.extendedProps.collabID,
      repeatGroup: event.extendedProps.repeatGroup,
    } as any);

    if (!event.extendedProps.repeatGroup) {
      setShowNotifyDialog(true);
    } else {
      setShowDragConfirm(true);
    }
  };

  useEffect(() => {
    if (!isInCollab) {
      if (session && selectedGroups.length === 0) {
        fetchEvents();
      }
    }
  }, [selectedGroups]);

  const confirmUpdate = (updateType: "current" | "all") => {
    setUpdateType(updateType);
    setShowDragConfirm(false);
    setShowNotifyDialog(true);
  };

  const handleEventResize = (resizeInfo: any) => {
    setCurrentEvent({
      id: resizeInfo.event.id,
      title: resizeInfo.event.title,
      start: resizeInfo.event.start,
      end: resizeInfo.event.end,
      collabID: resizeInfo.event.extendedProps.collabID,
      repeatGroup: resizeInfo.event.extendedProps.repeatGroup,
    } as EventType);

    if (!resizeInfo.event.extendedProps.repeatGroup) {
      setShowNotifyDialog(true);
    } else {
      setShowResizeConfirm(true);
    }
  };

  const confirmResize = (updateType: "current" | "all") => {
    setUpdateType(updateType);
    setShowResizeConfirm(false);
    setShowNotifyDialog(true);
  };

  const handleNotify = (notify: boolean) => {
    if (currentEvent) {
      handleEventDrag(currentEvent, updateType, notify);
    }
    setShowNotifyDialog(false);
  };

  const eventContent = (eventInfo: any) => {
    const timeDifferenceInMinutes =
      (new Date(eventInfo.event.end).getTime() -
        new Date(eventInfo.event.start).getTime()) /
      (1000 * 60);

    return (
      <>
        {/* <Tooltip placement="top" title="Drag & Drop or Resize to change schedule"> */}
        {timeDifferenceInMinutes > 30 ? (
          <div className="overflow-auto w-full h-full">
            <Typography className="flex flex-col w-full h-full align-middle">
              <Typography className="flex font-bold">
                {eventInfo.timeText}
              </Typography>
              <Typography
                flexWrap={"wrap"}
                textOverflow={"ellipsis"}
                className="w-full h-full break-words overflow-hidden"
              >
                {eventInfo.event.title}
              </Typography>
            </Typography>
          </div>
        ) : (
          <div className="overflow-auto w-full">
            <Typography className="flex flex-row truncate overflow-hidden">
              <Typography className="flex font-bold">
                {eventInfo.timeText}&nbsp;
              </Typography>
              <Typography className="w-full truncate ">
                {eventInfo.event.title}
              </Typography>
            </Typography>
          </div>
        )}
        {/* </Tooltip> */}
      </>
    );
  };

  const filteredOverlapEvents = overlapEvents.filter((overlapEvent: any) => {
    return !events.some((event: any) => event.id === overlapEvent.id);
  });

  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    setTimeout(() => {
      if (calendarRef.current) {
        calendarRef.current.getApi().updateSize();
      }
    }, 200);
  }, [onClick]);

  const handleEditEventSave = () => {
    setIsEditDialogOpen(false);
    setIsDetailDialogOpen(false);
  };

  return (
    <div className="w-full">
      {collabs.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full p-5">
          <span className="text-xl italic text-[#CFCFCF]">
            You are not in any collaboration group
          </span>
        </div>
      ) : (
        <div className="px-6 pb-6">
          <FullCalendar
            ref={calendarRef}
            timeZone="UTC"
            plugins={[timeGridPlugin, listPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            editable={!collabArchived}
            selectable={!collabArchived}
            allDaySlot={false}
            slotMinTime="08:00:00"
            slotMaxTime="24:00:00"
            titleRangeSeparator=" ~ "
            headerToolbar={{
              left: "today prev,next",
              center: "title",
              right: "timeGridWeek,timeGridDay,listWeek",
            }}
            dayHeaderFormat={{
              weekday: "short",
              day: "2-digit",
              month: "short",
            }}
            eventBorderColor="#999999"
            events={
              collabArchived ? events : [...filteredOverlapEvents, ...events]
            }
            select={handleDateSelect}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            eventContent={eventContent}
            eventClick={handleEventClick}
            eventOverlap={false}
          />

          <style>
            {`
            .fc-timeGridWeek-view {
              transition: width 1s ease-in-out;
            }
          `}
          </style>
        </div>
      )}

      <CreateEventDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        startStr={selectedInfo ? (selectedInfo as any).startStr : ""}
        endStr={selectedInfo ? (selectedInfo as any).endStr : ""}
        fetchEvents={fetchEvents}
        collabInfo={collabs}
        selectedGroups={selectedGroups}
      />

      {currentEvent && (
        <>
          <EditEventDialog
            open={isEditDialogOpen}
            onClose={handleEditEventSave}
            eventInfo={currentEvent}
            fetchEvents={fetchEvents}
            onSaved={() => setIsEditDialogOpen(false)}
            OnDelete={() => {
              fetchEvents();
              setIsEditDialogOpen(false);
            }}
          />
          <EventDetailsDialog
            open={isDetailDialogOpen}
            eventInfo={currentEvent}
            onClose={handleEditEventSave}
            onEdit={() => setIsEditDialogOpen(true)}
            onDeleteSuccess={(deletedEventId) => {
              handleEventDeletion(deletedEventId);
            }}
            onDeleteFailure={(error) => {
              console.error("Failed to delete event:", error);
            }}
            archiveStatus={collabArchived}
          />
        </>
      )}

      <ChooseDragDialog
        open={showDragConfirm}
        onClose={() => setShowDragConfirm(false)}
        onConfirm={confirmUpdate}
        fetchEvents={fetchEvents}
      />

      <ChooseResizeDialog
        open={showResizeConfirm}
        onClose={() => setShowResizeConfirm(false)}
        onConfirm={confirmResize}
        fetchEvents={fetchEvents}
      />

      <NotifyMembersDialog
        open={showNotifyDialog}
        onClose={() => setShowNotifyDialog(false)}
        onConfirm={handleNotify}
        fetchEvents={fetchEvents}
      />
    </div>
  );
}
