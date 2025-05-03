import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  ArrowBigRightDash,
  ImageIcon,
  Loader2Icon,
  PaperclipIcon,
  UserPlusIcon,
  XIcon,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateNewChatSchema,
  createNewChatSchema,
} from "@/schemas/chat.schema";
import { useState, useEffect } from "react";
import { IUser } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers } from "@/api/users.api";
import { Switch } from "../ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { createChat } from "@/api/chats.api";
import { AxiosResponse } from "axios";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

function NewChatDialog() {
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [creatingGroup, setCreatingGroup] = useState(false);

  const createNewChatForm = useForm<CreateNewChatSchema>({
    resolver: zodResolver(createNewChatSchema),
    defaultValues: {
      isGroupChat: false,
      chatName: "",
      participantIds: [],
      groupPhoto: null,
    },
  });

  const { data: response, isLoading } = useQuery({
    queryKey: ["searchedUsers"],
    queryFn: getUsers,
  });

  useEffect(() => {
    createNewChatForm.setValue("participantIds", selectedParticipants, {
      shouldValidate: true,
    });
  }, [selectedParticipants, createNewChatForm]);

  const groupPhoto = createNewChatForm.watch("groupPhoto");

  useEffect(() => {
    if (groupPhoto && groupPhoto.length > 0) {
      const file = groupPhoto[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [groupPhoto]);

  const queryClient = useQueryClient();

  const handleCreateNewChat = async (data: CreateNewChatSchema) => {
    setCreatingGroup(true);
    const loading = toast.loading("Chat Creating");
    try {
      const { isGroupChat, participantIds, chatName, groupPhoto } = data;
      const res = await createChat(
        isGroupChat,
        participantIds,
        chatName,
        groupPhoto[0]
      );
      toast.dismiss(loading);
      queryClient.setQueryData(["chats"], (staleData: AxiosResponse) => {
        const updatedChats = [...staleData.data.data, res.data.data];
        return {
          ...staleData,
          data: { ...staleData.data, data: updatedChats },
        };
      });
      toast.success("Chat Created Successfully");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setCreatingGroup(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <UserPlusIcon className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col sm:max-w-[500px] max-h-[90vh]">
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Chat</AlertDialogTitle>
          <AlertDialogDescription>
            Choose one or more users to start a conversation.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...createNewChatForm}>
          <form
            onSubmit={createNewChatForm.handleSubmit(handleCreateNewChat)}
            className="flex flex-col flex-1 space-y-4 overflow-hidden py-4"
          >
            <FormField
              control={createNewChatForm.control}
              name="isGroupChat"
              render={({ field }) => (
                <FormItem className="flex items-center gap-4">
                  <FormLabel>Group Chat?</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(e) => {
                        field.onChange(e);
                        setIsGroupChat(e);
                        setSelectedParticipants([]);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isGroupChat && (
              <>
                <FormField
                  control={createNewChatForm.control}
                  name="chatName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter group name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createNewChatForm.control}
                  name="groupPhoto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Group Photo (Optional)</FormLabel>
                      <FormControl>
                        <Button
                          variant="outline"
                          size="icon"
                          className="relative rounded-full"
                        >
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => field.onChange(e.target.files)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          {previewUrl ? (
                            <PaperclipIcon />
                          ) : (
                            <ImageIcon className="h-5 w-5" />
                          )}
                        </Button>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {previewUrl && (
                  <div>
                    <Image
                      src={previewUrl}
                      alt="Group preview"
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                  </div>
                )}
              </>
            )}

            <FormLabel>Select Participants</FormLabel>
            <div className="flex-1 overflow-y-auto space-y-2 ">
              {isLoading ? (
                <Loader2Icon className="animate-spin mx-auto" />
              ) : (
                response?.data.data.map((user: IUser) => (
                  <div
                    key={user._id}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-md hover:bg-muted",
                      selectedParticipants.includes(user._id) && "bg-muted"
                    )}
                  >
                    <Checkbox
                      checked={selectedParticipants.includes(user._id)}
                      onCheckedChange={(checked) => {
                        checked
                          ? setSelectedParticipants((prev) => [
                              ...prev,
                              user._id,
                            ])
                          : setSelectedParticipants((prev) =>
                              prev.filter((id) => id != user._id)
                            );
                      }}
                      disabled={
                        !isGroupChat &&
                        selectedParticipants.length > 0 &&
                        !selectedParticipants.includes(user._id)
                      }
                    />
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar?.url} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>
                <XIcon />
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                disabled={
                  (!isGroupChat && selectedParticipants.length === 0) ||
                  (isGroupChat && selectedParticipants.length < 2)
                }
              >
                Chat
                <ArrowBigRightDash />
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default NewChatDialog;
