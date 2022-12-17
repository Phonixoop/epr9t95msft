import { useEffect, useRef, useState } from "react";
import { useBasket } from "context/basketContext";
// icons
import ClockIcon from "ui/icons/clocks";
import ClockWithFlash from "ui/icons/clocks/with-flash";
import ChevronDownIcon from "ui/icons/chervons/chevron-down";
import ChevronUpIcon from "ui/icons/chervons/chervon-up";
import EmptyBasketIcon from "ui/icons/empty-basket/";
import HelmetIcon from "ui/icons/helmet";

//featuers
import DatePickerView from "features/date-picker";

//ui

import Price from "ui/cards/product/price";
import withLabel from "ui/forms/with-label";
import EnglishField from "ui/forms/english-field";
import Modal from "ui/modals";
import AddProductButton from "ui/cards/product/add-product-button";
import RadioBox from "ui/forms/radiobox";
import { TrashButton } from "ui/cards/product/add-product-button";

import { AnimatePresence, motion } from "framer-motion";
import PriceWithLabel from "ui/price-with-label";
import BasketButton from "features/basket-button";
import { DAYS } from "data";

const Days = Object.values(DAYS).reverse();
import moment from "jalali-moment";

const date = moment
  .from(new Date().toDateString(), "fa")
  .to(moment().add(1, "week"));
console.log({ date });
const EnglishFieldWithLable = withLabel(EnglishField);

export default function CheckoutCard({
  basketItems,
  total_price,
  coupon,
  isLoading = false,
  onCoupon = () => {},
  onClear = () => {},
  onClick = () => {},
}) {
  const { currentSelectedDateTime } = useBasket();
  return (
    <div className=" flex flex-col z-0 px-5 rounded-xl justify-center items-center gap-5 text-black w-full  text-center sticky top-[5.5em]">
      <ChooseTime />

      <div className="flex relative justify-start items-center gap-2 w-full bg-white px-3 py-4 rounded-md">
        <HelmetIcon />
        <span className="text-sm text-right">هزینه ارسال رایگان</span>
      </div>
      {basketItems.length > 0 ? (
        <>
          <div className="flex flex-col  justify-center items-center w-full gap-5  p-2 rounded-lg">
            <div className="flex w-full justify-between items-center px-1  rounded-md py-2">
              <span className="text-sm font-bold">
                سبد خرید ({basketItems.length})
              </span>
              <span>
                <TrashButton
                  className="bg-atysa-100"
                  onClick={() => onClear()}
                />
              </span>
            </div>
            <BasketItemList list={basketItems} />

            <motion.div
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", delay: 0 }}
              className="flex flex-col  justify-center items-center w-full gap-5  p-2 rounded-lg"
            >
              <PriceWithLabel price={total_price}>مجموع</PriceWithLabel>
              <PriceWithLabel
                price={total_price * 0.09}
                max={total_price.toString().length + 1}
              >
                مالیات
              </PriceWithLabel>
              <PriceWithLabel
                className="text-atysa-900 font-bold"
                price={total_price * 1.09}
                max={total_price.toString().length + 1}
              >
                مبلغ قابل پرداخت
              </PriceWithLabel>
              <div className="w-full">
                <EnglishFieldWithLable
                  upperCase
                  bg="bg-transparent"
                  label={"کد تخفیف"}
                  value={coupon}
                  onChange={(val) => onCoupon(val)}
                />
              </div>
            </motion.div>
          </div>
        </>
      ) : (
        <div className="my-20 flex flex-col w-full justify-center items-center gap-5">
          <EmptyBasketIcon />
          <span className="font-bold text-sm text-gray-400 ">
            سبد خرید شما خالی است!
          </span>
        </div>
      )}
      {basketItems.length > 0 && (
        <div className="sticky bottom-0 w-full  pb-10  bg-gradient-to-t backdrop-blur-sm ">
          <BasketButton
            disabled={
              isLoading ||
              !(
                currentSelectedDateTime.day.dayName &&
                currentSelectedDateTime.time.period.value
              )
            }
            isLoading={isLoading}
            className="bg-atysa-main z-0 "
            onClick={() => {
              onClick();
            }}
          >
            ثبت سفارش
          </BasketButton>
        </div>
      )}
    </div>
  );
}

function BasketItemList({ list = [] }) {
  return list.map((item) => {
    return <BasketItem key={item.id} item={item} />;
  });
}

function BasketItem({ item }) {
  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", delay: 0 }}
      className="flex flex-col justify-start items-center w-full  py-2 border-b-2  p-2 rounded-md"
    >
      <span className="w-full text-right">{item.product.name}</span>
      <div className="flex justify-between items-center w-full ">
        <Price price={item.product.price} />
        <AddProductButton id={item.id} product={item.product} />
      </div>
    </motion.div>
  );
}

function ChooseTime({ onChange = () => {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedDateTimeRadioBox, currentSelectedDateTime } = useBasket();
  return (
    <div className="flex h-full  relative justify-center items-center z-10 gap-1 w-full bg-white px-3 py-4 rounded-md">
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className={`flex w-full justify-between items-center ${
          !isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex justify-right  h-full items-center flex-1 gap-2">
          <ClockWithFlash />
          <div className="flex justify-center min-h-[1.6rem] items-center gap-2 text-sm text-right overflow-hidden">
            {selectedDateTimeRadioBox.id === 0 ? (
              <>
                <span> دریافت در سریع ترین زمان ممکن</span>
              </>
            ) : (
              <>
                <span>زمان دریافت</span>

                <SelectedDateTimeStringFormat
                  className="w-fit bg-atysa-primary text-atysa-main rounded-lg flex gap-1 justify-start font-bold p-1"
                  date={currentSelectedDateTime}
                />
              </>
            )}
          </div>
        </div>

        <ChevronDownIcon />
      </button>
      {isOpen && (
        <div className="absolute inset-0 min-h-fit flex flex-col justify-start items-center  px-3 py-4 bg-white/60 backdrop-blur-sm drop-shadow-2xl rounded-md ">
          <button
            onClick={() => setIsOpen(false)}
            type="button"
            className="flex w-full justify-between items-center"
          >
            <div className="flex flex-1 gap-2">
              <ClockIcon />
              <span className="text-sm text-right">زمان دریافت سفارش</span>
            </div>

            <ChevronUpIcon />
          </button>
          <DatePickerButton onChange={onChange} />
        </div>
      )}
    </div>
  );
}
function DatePickerButton({ onChange = () => {} }) {
  const {
    setToFastestDateTime,
    selectedDateTimeRadioBox,
    setSelectedDateTimeRadioBox,
    currentSelectedDateTime,
  } = useBasket();
  const [modal, setModal] = useState({ isOpen: false });

  return (
    <>
      <div className="flex flex-col gap-4 justify-start items-center w-full pt-5">
        <div className="flex justify-between gap-2 w-full">
          <RadioBox
            checked={selectedDateTimeRadioBox.id === 0}
            onClick={() => {
              setSelectedDateTimeRadioBox({ id: 0 });
              setToFastestDateTime();
            }}
          >
            سریع ترین زمان ممکن
          </RadioBox>
          <ClockWithFlash />
        </div>
        <div className="w-full h-[1px] bg-gray-300" />
        <div className="flex justify-startitems-center w-full">
          <RadioBox
            checked={selectedDateTimeRadioBox.id === 1}
            onClick={() => {
              setSelectedDateTimeRadioBox({ id: 1 });
              setModal({ isOpen: true });
            }}
          >
            زمان دیگر
          </RadioBox>
        </div>

        <div className="w-full flex gap-1 justify-start font-bold text-atysa-main px-6">
          {currentSelectedDateTime.day.dayName &&
            currentSelectedDateTime.time.period.value && (
              <>
                <SelectedDateTimeStringFormat date={currentSelectedDateTime} />
              </>
            )}
        </div>
      </div>
      <Modal
        center
        size="sm"
        title="انتخاب زمان ارسال"
        isOpen={modal.isOpen}
        onClose={() => {
          console.log("hi modal");
          if (
            currentSelectedDateTime.day.dayName &&
            currentSelectedDateTime.time.period.value
          )
            setSelectedDateTimeRadioBox({ id: 1 });
          else {
            setSelectedDateTimeRadioBox({ id: 0 });
          }

          setModal({ isOpen: false });
        }}
      >
        <div className="flex justify-center items-center">
          <DatePickerView />
        </div>
      </Modal>
    </>
  );
}

function DatePicker() {
  const [selectedTab, setSelectedTab] = useState(Days[0]);

  return (
    <>
      <div className="flex flex-col gap-2 justify-center items-center w-full mx-auto ">
        <div className="">
          <ul className="flex ">
            {Days.map((item) => (
              <li
                key={item.label}
                className={`relative cursor-pointer p-2 text-center  z-10 transition-shadow ${
                  item === selectedTab ? " text-atysa-800 " : ""
                }`}
                onClick={() => setSelectedTab(item)}
              >
                {item}
                {item === selectedTab ? (
                  <motion.div
                    className="absolute inset-0  border-b-atysa-800 border-b-2 rounded-t-lg -z-10 "
                    layoutId="underline"
                  />
                ) : null}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <AnimatePresence exitBeforeEnter>
            <motion.div
              key={selectedTab ? selectedTab.label : "empty"}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {selectedTab ? selectedTab : "😋"}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
function SelectedDateTimeStringFormat({
  className = "w-full flex gap-1 justify-start font-bold text-atysa-main px-1",
  date = undefined,
}) {
  if (!date) return "";
  return (
    <>
      {date.day.dayName && date.time.period.value && (
        <div className={className}>
          <span>
            {date.day.dayName} {date.day.date}
          </span>
          <span className="font-bold">
            {date.time.period.value.split("-")[0]}
          </span>

          <span className="font-bold"> تا </span>
          <span className="font-bold">
            {date.time.period.value.split("-")[1]}
          </span>
        </div>
      )}
    </>
  );
}
