import { IMessage } from "@/types";
import Image from "next/image";
import moment from "moment";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  DownloadCloudIcon,
  EllipsisIcon,
  FileIcon,
  SquareArrowOutUpRightIcon,
  TrashIcon,
  XIcon,
  ZoomInIcon,
} from "lucide-react";
import Link from "next/link";

interface MessageProps {
  isCurrentUserMessage: boolean;
  message: IMessage;
  isGroupChat: boolean;
}

function Message({ message, isCurrentUserMessage, isGroupChat }: MessageProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showMessageOptions, setShowMessageOptions] = useState(false);

  return (
    <>
      {imagePreview ? (
        <div className="h-full z-40 p-8 overflow-hidden w-full absolute inset-0 bg-black/70 flex justify-center items-center">
          <XIcon
            className="absolute top-5 right-5 w-9 h-9 text-white cursor-pointer"
            onClick={() => setImagePreview(null)}
          />
          <img
            className="w-full h-full object-contain"
            src={imagePreview}
            alt="Image Preview"
          />
        </div>
      ) : null}
      <div
        className={`flex ${
          isCurrentUserMessage ? "justify-end" : "justify-start"
        } items-end gap-3 p-2`}
      >
        <div
          className={`rounded-full grid grid-rows-2 justify-start group ${
            isCurrentUserMessage ? "order-2" : "order-1"
          }`}
        >
          {isGroupChat && !isCurrentUserMessage ? (
            <Image
              width={35}
              height={35}
              src={
                message.sender.avatar.url ||
                "https://gravatar.com/avatar/af2d8aa25a2490e0821d22de54d7c6e0?s=400&d=robohash&r=x"
              }
              alt="Message Sender Avatar"
            />
          ) : null}
        </div>
        <div
          onMouseLeave={() => setShowMessageOptions(false)}
          className={`rounded-3xl flex flex-col ${
            typeof message.message === "string"
              ? "p-1 pt-2 gap-y-0"
              : "p-2 gap-y-2"
          } cursor-pointer group text-white ${
            isCurrentUserMessage
              ? "bg-[#045E54] font-medium dark:bg-[#045E54]"
              : " bg-gray-800"
          } ${
            isCurrentUserMessage
              ? "order-1 rounded-br-none"
              : "order-2 rounded-bl-none"
          }
          `}
        >
          {isCurrentUserMessage ? (
            <div
              className={`self-center relative w-full hidden group-hover:flex justify-end cursor-pointer`}
              onClick={() => setShowMessageOptions((prev) => !prev)}
            >
              <EllipsisIcon className="transition-all ease-in-out duration-100 text-zinc-300" />
              <div
                className={`z-30 text-left absolute bottom-full bg-gray-700 translate-y-1 text-[10px] w-auto bg-dark rounded-2xl p-2 shadow-md border-[1px] border-secondary ${
                  showMessageOptions ? "block" : "hidden"
                }`}
              >
                <Button
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    const ok = confirm(
                      "Are you sure you want to delete this message"
                    );
                    if (ok) console.log("Deleted"); // delete message function
                  }}
                  role="button"
                  className="cursor-pointer p-4 text-danger rounded-lg w-auto inline-flex items-center hover:bg-secondary"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete Message
                </Button>
              </div>
            </div>
          ) : null}
          {isGroupChat && !isCurrentUserMessage && <p>{message.sender.name}</p>}

          {typeof message.message === "string" ? (
            <p className="text-md px-2 pt-1 flex justify-start">{message.message}</p>
          ) : message.message.file.url.includes(".png") ||
            message.message.file.url.includes(".jpg") ||
            message.message.file.url.includes(".jpeg") ? (
            <div className="group relative rounded-xl overflow-hidden cursor-pointer">
              <div className="absolute inset-0 z-20 flex justify-center items-center w-full gap-2 h-full bg-black/60 group-hover:opacity-100 opacity-0 transition-opacity ease-in-out duration-150">
                <Button
                  className="cursor-pointer"
                  onClick={() => {
                    if (typeof message.message === "string") return;
                    setImagePreview(message.message.file.url);
                  }}
                >
                  <ZoomInIcon />
                </Button>
                <Button className="cursor-pointer">
                  <Link
                    target="_blank"
                    href={message.message.file.url}
                    download
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DownloadCloudIcon />
                  </Link>
                </Button>
              </div>
              <Image
                className="rounded-sm object-cover cursor-pointer"
                width={200}
                height={200}
                src={message.message.file.url}
                alt="Message File"
              />
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden flex justify-center p-0 group-hover:p-4">
              <div className="absolute inset-0 z-20 flex justify-center items-center w-full gap-2 h-full bg-black/60 group-hover:opacity-100 opacity-0 transition-opacity ease-in-out duration-150">
                <Button>
                  <SquareArrowOutUpRightIcon />
                </Button>
                <Button>
                  <Link
                    target="_blank"
                    href={message.message.file.url}
                    download
                  >
                    <DownloadCloudIcon />
                  </Link>
                </Button>
              </div>
              <FileIcon className="h-[50px] w-[50px]" />
            </div>
          )}

          <div
            className={`pt-1 w-full self-end text-sm flex items-center justify-between cursor-text ${
              isCurrentUserMessage ? "text-zinc-50" : "text-zinc-400"
            }`}
          >
            {typeof message.message !== "string" ? (
              <div className="flex text-md font-semibold text-center ml-4 justify-between gap-12">
                {message.message.file.url.includes(".png") ||
                message.message.file.url.includes(".jpg") ||
                message.message.file.url.includes(".jpeg") ? (
                  message.message.caption
                ) : (
                  <p className="truncate mr-6">{message.message.file.original_filename + ".raw" }</p>
                )}
              </div>
            ) : null}
            <p className="w-full text-[10px] text-right">
              {moment(message.updatedAt)
                .add("TIME_ZONE", "hours")
                .fromNow(true)}{" "}
              ago
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Message;
