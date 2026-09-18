import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Dialog, IconButton, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

type ImageThumbnailProps = {
    src?: string | null;
    alt?: string;
    width?: number;
    height?: number;
}

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ src, alt = "Preview", width = 100, height = 100 }) => {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);

    // Determine if the file is a PDF based on the URL extension
    const isPdf = useMemo(() => {
        if (!src) return false;
        const ext = src.toLowerCase().slice(src.lastIndexOf("."));
        return ext === ".pdf";
    }, [src]);

    if (!src) {
        return <span>—</span>;
    }

    return (
        <>
            {/* Thumbnail */}
            <div
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    position: "relative",
                    cursor: error ? "default" : "pointer",
                    overflow: "hidden",
                    padding: "10px",
                    border: isPdf ? "1px solid #ddd" : "none",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isPdf ? "#f5f5f5" : "transparent",
                }}
                onClick={() => !error && setOpen(true)}
            >
                {isPdf ? (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                        <PictureAsPdfIcon sx={{ fontSize: 40, color: "error.main" }} />

                    </Box>
                ) : (
                        <Image
                            src={src}
                            alt={alt}
                            fill
                            style={{
                                objectFit: "contain",
                            }}
                            onError={() => setError(true)}
                            onLoad={() => setError(false)}
                        />
                )}
            </div>

            {/* Dialog */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="lg"
                fullWidth
                slotProps={{
                    backdrop: {
                        sx: {
                            backgroundColor: "rgba(128, 128, 128, 0.9)", // gray with opacity
                        },
                    },
                    paper: {
                        sx: {
                            background: isPdf ? "white" : "transparent", // white background for PDF
                            boxShadow: isPdf ? "default" : "none", // shadow for PDF
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            p: isPdf ? 2 : 2, // padding
                            maxHeight: "90vh",
                        },
                    },
                }}
            >
                <Box sx={{ position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <IconButton
                        onClick={() => setOpen(false)}
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            color: isPdf ? "text.primary" : "white",
                            zIndex: 1,
                            backgroundColor: isPdf ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.5)",
                            "&:hover": {
                                backgroundColor: isPdf ? "rgba(255, 255, 255, 1)" : "rgba(0, 0, 0, 0.7)",
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {isPdf ? (
                        <iframe
                            src={src}
                            title={alt}
                            style={{
                                width: "100%",
                                height: "80vh",
                                border: "none",
                                borderRadius: "8px",
                            }}
                        />
                    ) : (
                            <Image
                                src={src}
                                alt={alt}
                                width={600}
                                height={600}
                                style={{
                                    borderRadius: "8px",
                                    backgroundColor: "white",
                                    maxHeight: "80vh",
                                    minWidth: "300px",
                                    width: "auto",
                                    height: "auto",
                                }}
                            />
                    )}
                </Box>
            </Dialog>
        </>
    );
};

export default ImageThumbnail;
