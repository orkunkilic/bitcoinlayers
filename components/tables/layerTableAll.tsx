import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Layer } from "@/components/layer/layerProps";
import Risk from "@/components/layer/layerTableItemRisk";
import TableHeader from "@/components/tables/tableHeader";
import { BrowserView, MobileView, isMobile } from "react-device-detect";

type TableTabKey =
    | "Risk"
    | "Type"
    | "Status"
    | "Unit of Account"
    | "BTC Locked";

interface Props {
    data: Layer[];
    headers: {
        name: string;
        showSorting: boolean;
        filterOptions?: string[];
        mobileLabel: string;
    }[];
}

const LayerImage = ({ src, title }: { src: string; title: string }) => {
    const [imageSrc, setImageSrc] = useState(src);

    useEffect(() => {
        setImageSrc(src);
    }, [src]);

    const handleError = () => {
        setImageSrc("/bitcoinlayers-logo.png");
    };

    return (
        <Image
            src={imageSrc}
            alt={`${title} logo`}
            width={20}
            height={20}
            onError={handleError}
        />
    );
};

const LayerTableAll = ({ data, headers }: Props) => {
    const router = useRouter();
    const [filter, setFilter] = useState<"Mainnet" | "Testnet" | "All">(
        "Mainnet",
    );
    // const [filters, setFilters] = useState<{ [key: string]: string[] }>({});
    const [sortedData, setSortedData] = useState(data);
    const [sortOrder, setSortOrder] = useState<{
        [key: string]: boolean | null;
    }>({});
    const [mobileActiveTab, setMobileActiveTab] = useState<TableTabKey>("Type");
    const [showMainnet, setShowMainnet] = useState(true);
    // const [showBitcoinonly, setShowBitcoinonly] = useState(false);

    useEffect(() => {
        // Default sorting by Name alphabetically on first load
        handleSort("Name", true);

        // Check the URL to set the BTC filter
        // const urlParams = new URLSearchParams(window.location.search);

        // if (
        //     urlParams.has("btc") ||
        //     urlParams.has("btc-only") ||
        //     urlParams.has("maxi") ||
        //     urlParams.has("laser-eyes")
        // ) {
        //     setShowBitcoinonly(true);
        // }
    }, []);

    const handleRowClick = (destination: string) => {
        router.push(destination);
    };

    const handleSort = (header: string, ascending: boolean) => {
        const sorted = [...sortedData].sort((a, b) => {
            let valueA, valueB;
            switch (header) {
                case "Name":
                    valueA = a.title.toLowerCase();
                    valueB = b.title.toLowerCase();
                    break;
                case "Type":
                    valueA = a.layerType;
                    valueB = b.layerType;
                    break;
                case "Status":
                    valueA = a.live;
                    valueB = b.live;
                    break;
                case "Unit of Account":
                    valueA = a.nativeToken;
                    valueB = b.nativeToken;
                    break;
                case "BTC Locked":
                    valueA = a.btcLocked;
                    valueB = b.btcLocked;
                    break;
                default:
                    return 0;
            }
            if (valueA < valueB) return ascending ? -1 : 1;
            if (valueA > valueB) return ascending ? 1 : -1;
            return 0;
        });
        setSortedData(sorted);
        setSortOrder({ [header]: ascending });
    };

    const handleFilter = (header: string, value: string) => {
        setFilter(value as "Mainnet" | "Testnet" | "All");
    };

    // const handleFilter = (header: string, value: string) => {
    //     setFilter((prevFilters) => {
    //         const newFilters = { ...prevFilters };
    //         if (!newFilters[header]) {
    //             newFilters[header] = [];
    //         }
    //         if (newFilters[header].includes(value)) {
    //             newFilters[header] = newFilters[header].filter(
    //                 (v) => v !== value,
    //             );
    //         } else {
    //             newFilters[header].push(value);
    //         }
    //         return newFilters;
    //     });
    // };

    const filteredData = sortedData.filter((item) => {
        if (filter === "Mainnet") return item.live === "Mainnet";
        if (filter === "Testnet") return item.live !== "Mainnet";
        return true;
    });

    // const filteredData = sortedData
    //     .filter((item) => {
    //         return Object.keys(filters).every((header) => {
    //             if (!filters[header].length) return true;
    //             switch (header) {
    //                 case "Type":
    //                     return filters[header].includes(item.layerType);
    //                 case "Status":
    //                     return filters[header].includes(item.live);
    //                 default:
    //                     return true;
    //             }
    //         });
    //     })
    //     .filter((item) => (showMainnet ? item.live === "Mainnet" : true));
    // .filter((item) => (showBitcoinonly ? item.bitcoinOnly == true : true));

    const handleMobileTabClick = (tab: TableTabKey) => {
        setMobileActiveTab(tab);
    };

    const mobileTableHeaders = headers.filter(
        (_item) => _item.name === mobileActiveTab || _item.name === "Name",
    );

    return (
        <div className="px-6 lg:px-0 w-full">
            <div className="flex lg:mb-6 justify-center -mt-12 lg:mt-0 relative z-20">
                <div className="justify-start items-start gap-4 inline-flex">
                    <div
                        className={`h-[30px] px-4 py-[5px] rounded-full border-2 justify-center items-center gap-1.5 flex cursor-pointer ${
                            filter === "Mainnet"
                                ? "bg-white border-orange-600"
                                : "border-slate-300"
                        }`}
                        onClick={() => setFilter("Mainnet")}
                    >
                        <div
                            className={`text-center text-sm font-medium leading-tight ${
                                filter === "Mainnet"
                                    ? "text-orange-600"
                                    : "text-slate-600"
                            }`}
                        >
                            Mainnet
                        </div>
                    </div>
                    <div
                        className={`h-[30px] rounded-full border-2 justify-center items-center gap-1 flex cursor-pointer ${
                            filter === "Testnet"
                                ? "bg-white border-orange-600"
                                : "border-slate-300"
                        }`}
                        onClick={() => setFilter("Testnet")}
                    >
                        <div className="grow shrink basis-0 h-[30px] px-4 py-[5px] justify-center items-center gap-1.5 flex">
                            <div
                                className={`text-center text-sm font-medium leading-tight ${
                                    filter === "Testnet"
                                        ? "text-orange-600"
                                        : "text-slate-600"
                                }`}
                            >
                                Testnet
                            </div>
                        </div>
                    </div>
                    <div
                        className={`h-[30px] rounded-full border-2 justify-center items-center gap-1 flex cursor-pointer ${
                            filter === "All"
                                ? "bg-white border-orange-600"
                                : "border-slate-300"
                        }`}
                        onClick={() => setFilter("All")}
                    >
                        <div className="grow shrink basis-0 h-[30px] px-4 py-[5px] justify-center items-center gap-1.5 flex">
                            <div
                                className={`text-center text-sm font-medium leading-tight ${
                                    filter === "All"
                                        ? "text-orange-600"
                                        : "text-slate-600"
                                }`}
                            >
                                All
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="flex lg:mb-6 justify-center mt-6 mb-6 lg:mt-0 relative z-20">
                <div className="justify-start items-start gap-4 inline-flex">
                    <div
                        className={`h-[30px] rounded-full border-2 justify-center items-center gap-1 flex cursor-pointer ${
                            showBitcoinonly
                                ? "bg-green-500 border-green-600"
                                : "bg-gray-300 border-gray-400"
                        }`}
                        onClick={() => setShowBitcoinonly(!showBitcoinonly)}
                    >
                        <div className="grow shrink basis-0 h-[30px] px-4 py-[5px] justify-center items-center gap-1.5 flex">
                            <div
                                className={`text-center text-sm font-medium leading-tight ${
                                    showBitcoinonly
                                        ? "text-white"
                                        : "text-gray-700"
                                }`}
                            >
                                BTC Only
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            <MobileView className="flex justify-center">
                <div className="justify-center lg:items-start gap-4 inline-flex py-3">
                    {headers.slice(2).map((_item, ind) => {
                        const isAllowedTab = [
                            "Risk",
                            "Type",
                            "Status",
                            "Unit of Account",
                            "BTC Locked",
                        ].includes(_item.name);
                        return (
                            <div
                                className={`h-[30px] px-4 py-[5px] rounded-full border-2 justify-center items-center gap-1.5 flex cursor-pointer ${
                                    mobileActiveTab === _item.name
                                        ? "bg-white border-orange-600"
                                        : "border-slate-300"
                                }`}
                                onClick={() =>
                                    isAllowedTab &&
                                    handleMobileTabClick(
                                        _item.name as TableTabKey,
                                    )
                                }
                                key={ind}
                            >
                                <div
                                    className={`text-center text-sm font-medium leading-tight ${
                                        mobileActiveTab === _item.name
                                            ? "text-orange-600"
                                            : "text-slate-600"
                                    }`}
                                >
                                    {_item.mobileLabel}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </MobileView>
            <div className="overflow-x-auto bg-lightsecondary rounded-xl mx-auto border border-stroke_tertiary">
                <table className="bg-lightsecondary w-full text-sm text-left rtl:text-right rounded-xl">
                    <TableHeader
                        headers={isMobile ? mobileTableHeaders : headers}
                        onSort={handleSort}
                        onFilter={handleFilter}
                    />
                    <tbody className="bg-white gap-x-8 border-t border-stroke_tertiary text_table_important">
                        {filteredData.map((item, index) => (
                            <tr
                                className={`cursor-pointer border-b border-stroke_tertiary text_table_important ${
                                    index === filteredData.length - 1 ? "" : ""
                                }`}
                                key={item.slug}
                                onClick={() =>
                                    handleRowClick(`/layers/${item.slug}`)
                                }
                            >
                                <td className="lg:px-6 px-4 py-4 font-semibold whitespace-nowrap border-r lg:border-r-0 border-stroke_tertiary text_table_important text-table_body">
                                    <div className="flex items-center">
                                        <LayerImage
                                            src={`/logos/${item.slug}.png`}
                                            title={item.title}
                                        />
                                        <span className="ml-2 truncate lg:word-break-none">
                                            {item.title}
                                        </span>
                                    </div>
                                </td>
                                {!isMobile && (
                                    <td className="relative px-2 border-stroke_tertiary text_table_important">
                                        {item.underReview === "no" ? (
                                            <Risk layer={item} />
                                        ) : (
                                            <div className="px-5 text_table_important">
                                                Under review
                                            </div>
                                        )}
                                    </td>
                                )}
                                {(!isMobile || mobileActiveTab === "Type") && (
                                    <td className="lg:px-6 px-4 py-3 lg:py-4 border-stroke_tertiary text_table_important">
                                        {item.layerType}
                                    </td>
                                )}
                                {(!isMobile ||
                                    mobileActiveTab === "Status") && (
                                    <td className="lg:px-6 px-4 py-3 lg:py-4 border-stroke_tertiary text_table_important">
                                        {item.live}
                                    </td>
                                )}
                                {(!isMobile ||
                                    mobileActiveTab === "Unit of Account") && (
                                    <td className="lg:px-6 px-4 py-3 lg:py-4 border-stroke_tertiary text_table_important">
                                        <div className="flex items-center">
                                            {item.nativeToken
                                                .toLowerCase()
                                                .includes("btc") && (
                                                <Image
                                                    src="/btc.svg"
                                                    alt="BTC logo"
                                                    width={20}
                                                    height={20}
                                                    className="mr-2"
                                                />
                                            )}
                                            {item.nativeToken}
                                        </div>
                                    </td>
                                )}
                                {(!isMobile ||
                                    mobileActiveTab === "BTC Locked") && (
                                    <td className="lg:px-6 px-4 py-3 lg:py-4 border-r border-stroke_tertiary text_table_important">
                                        {item.underReview === "yes" ||
                                        !Number(item.btcLocked) ? (
                                            <div>-</div>
                                        ) : (
                                            <div>
                                                ₿{" "}
                                                {Number(
                                                    item.btcLocked,
                                                ).toLocaleString()}
                                            </div>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LayerTableAll;
