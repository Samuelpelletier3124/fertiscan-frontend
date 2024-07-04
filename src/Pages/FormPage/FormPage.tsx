import React, {
  useState,
  useRef,
  useEffect,
  StrictMode,
  useContext,
  useCallback,
} from "react";
import "./FormPage.css";
import {
  SessionContext,
  SetSessionContext,
} from "../../Utils/SessionContext.tsx";
import Carousel from "../../Components/Carousel/Carousel";
import ProgressBar from "../../Components/ProgressBar/ProgressBar";
import SectionComponent from "../../Components/Section/Section.tsx";
import Section from "../../Model/Section-Model.tsx";
import Input from "../../Model/Input-Model.tsx";
import Data from "../../Model/Data-Model.tsx";
import { FormClickActions } from "../../Utils/EventChannels.tsx";
import { useTranslation } from "react-i18next";
import RefCollectorContext from '../../Context/RefCollectorContext';


const FormPage = () => {
  const { t } = useTranslation();
  // Ref collector table
  const [FormDivRefs, setFormDivRefs] = useState<HTMLDivElement[]>([]);
  const [ScrollBarDivRefs, setScrollBarDivRefs] = useState<HTMLDivElement[]>([]);
  const [inputsHeights, setInputsHeights] = useState<number[]>([]);
  const [lastModifiedDiv, setLastModifiedDiv] = useState<HTMLDivElement | null>(null);
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);
  const [scrollBarPosition, setScrollBarPosition] = useState({ top:0});
  // @ts-expect-error : setForm is going to be used when linked to db
  // eslint-disable-next-line
  const [form, setForm] = useState({
    company_name: "",
    company_address: "",
    company_website: "",
    company_phone_number: "",
    manufacturer_name: "",
    manufacturer_address: "",
    manufacturer_website: "",
    manufacturer_phone_number: "",
    fertiliser_name: "",
    registration_number: "",
    lot_number: "",
    weight_kg: "",
    weight_lb: "",
    density: "",
    volume: "",
    npk: "",
    warranty: "",
    cautions_en: [],
    instructions_en: [],
    micronutrients_en: [],
    organic_ingredients_en: [],
    inert_ingredients_en: [],
    specifications_en: [],
    first_aid_en: [],
    cautions_fr: [],
    instructions_fr: [],
    micronutrients_fr: [],
    organic_ingredients_fr: [],
    inert_ingredients_fr: [],
    specifications_fr: [],
    first_aid_fr: [],
    guaranteed_analysis: [],
  });

  const [centerY, setYCenter] = useState<number>();

  useEffect(() => {
    // Définition de la fonction qui met à jour centerY
    function updateCenter() {
      // Calcul de la nouvelle valeur de centerY
      const newCenterY = window.innerHeight / 2;
      setYCenter(newCenterY); // Mise à jour de l'état
    }
    // Enregistrement de la fonction comme écouteur d'événement pour l'événement de redimensionnement
    window.addEventListener('resize', updateCenter);
    
    // Mise à jour initiale de centerY lors du premier rendu
    updateCenter();

    // Fonction de nettoyage qui sera appelée lors du démontage du composant
    return () => {
      window.removeEventListener('resize', updateCenter);
    };
  }, []);

  useEffect(() => {

  }, [centerY]);

  useEffect(() => {
    let closest = null;
    let smallestDifference = Number.POSITIVE_INFINITY;

    FormDivRefs.forEach((divRef) => {
      if (divRef && centerY) {
        const rect = divRef.getBoundingClientRect();
        const divCenterY = rect.top + rect.height / 2;
        const difference = Math.abs(centerY - divCenterY);

        if (difference < smallestDifference) {
          smallestDifference = difference;
          closest = (divRef.children[0] as HTMLLabelElement).innerHTML;
          console.log("Closest div is:", closest);
        }
      }
    });
}, [window.innerHeight, window.scrollY]);

  const { state } = useContext(SessionContext);
  const { setState } = useContext(SetSessionContext);
  const blobs = state.data.pics;
  const [loading, setLoading] = useState(true);
  // @ts-expect-error : has to be used to prompt user when error
  // eslint-disable-next-line
  const [fetchError, setError] = useState<Error | null>(null);
  const [urls, setUrls] = useState<
    {
      url: string;
      title: string;
    }[]
  >([]);

  // this object describes how the formPage data will looks like
  const [data, setData] = useState<Data>(
    new Data([
      new Section("Company information", "company", [
        new Input(t("name"), form.company_name, "company_name"),
        new Input(t("address"), form.company_address, "company_address"),
        new Input(t("website"), form.company_website, "company_website"),
        new Input(
          t("phone_number"),
          form.company_phone_number,
          "company_phone_number",
        ),
      ]),
      new Section("Manufacturer information", "manufacturer", [
        new Input(t("name"), form.manufacturer_name, "manufacturer_name"),
        new Input(
          t("address"),
          form.manufacturer_address,
          "manufacturer_address",
        ),
        new Input(
          t("website"),
          form.manufacturer_website,
          "manufacturer_website",
        ),
        new Input(
          t("phone_number"),
          form.manufacturer_phone_number,
          "manufacturer_phone_number",
        ),
      ]),
      new Section("Product information", "fertiliser", [
        new Input(t("name"), form.fertiliser_name, "fertiliser_name"),
        new Input(
          t("registrationNumber"),
          form.registration_number,
          "registration_number",
        ),
        new Input(t("lotNumber"), form.lot_number, "lot_number"),
        new Input(t("weightKg"), form.weight_kg, "weight_kg"),
        new Input(t("weightLb"), form.weight_lb, "weight_lb"),
        new Input(t("density"), form.density, "density"),
        new Input(t("volume"), form.volume, "volume"),
        new Input(t("npk"), form.npk, "npk"),
        new Input(t("warranty"), form.warranty, "warranty"),
      ]),
    ]),
  );

  const modals: {
    label: string;
    ref: React.MutableRefObject<HTMLDivElement | null>;
  }[] = [];
  // eslint-disable-next-line
  const textareas: {
    label: string;
    ref: React.MutableRefObject<HTMLTextAreaElement | null>;
  }[] = [];

  data.sections.forEach((sectionInfo) => {
    sectionInfo.inputs.forEach((inputInfo) => {
      // eslint-disable-next-line
      const modal = useRef<HTMLDivElement | null>(null);
      modals.push({
        label: sectionInfo.label + inputInfo.label,
        ref: modal,
      });
      // eslint-disable-next-line
      const textarea = useRef<HTMLTextAreaElement | null>(null);
      textareas.push({
        label: sectionInfo.label + inputInfo.label,
        ref: textarea,
      });
    });
  });

  const resizeTextarea = (textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  const api_url = "http://localhost:5000";
  /**
  const _approveAll = () => {
    data.sections.forEach((section) => {
      section.inputs.forEach((input) => {
        input.property = "approved";
        FormClickActions.emit("ApproveClick", input);
      });
    });
    updateData();
  };
  
  window.approveAll = approveAll;
  */
  /**
   * Prepare and send request to backend for file analysis
   * @returns data : the data retrieved from the backend
   */
  const analyse = async () => {
    const formData = new FormData();
    for (let i = 0; i < blobs.length; i++) {
      const blobData = await fetch(blobs[i].blob).then((res) => res.blob());
      formData.append("images", blobData, blobs[i].name);
    }
    const data = await (
      await fetch(api_url + "/analyze", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Headers":
            "Origin, Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, locale",
          "Access-Control-Allow-Methods": "GET, POST",
        },
        body: formData,
      })
    ).json();
    return data;
  };

  useEffect(() => {
    // load imgs for the carousel
    const newUrls = blobs.map((blob) => ({ url: blob.blob, title: blob.name }));
    // Set the urls state only once with all the transformations
    setUrls(newUrls);

    // if no data in session, data has never been loaded and has to be fetched
    if (state.data.form.sections.length == 0) {
      if (process.env.REACT_APP_ACTIVATE_USING_JSON == "true") {
        // skip backend take answer.json as answer
        fetch("/answer.json").then((res) =>
          res.json().then((response) => {
            data.sections.forEach((section) => {
              section.inputs.forEach((input) => {
                input.value =
                  typeof response[input.id] == "string"
                    ? response[input.id]
                    : "";
              });
            });
            updateData();
          }),
        );
      } else {
        // fetch backend
        analyse()
          .then((response) => {
            data.sections.forEach((section) => {
              section.inputs.forEach((input) => {
                input.value =
                  typeof response[input.id] == "string"
                    ? response[input.id]
                    : "";
              });
            });
            updateData();
            setState({ ...state, data: { pics: blobs, form: data } });
          })
          .catch((e) => {
            setLoading(false);
            setError(e);
            console.log(e);
          });
      }
    } else {
      state.data.form.sections.forEach((section) => {
        data.sections
          .find((currentSection) => currentSection.label == section.label)!
          .inputs.forEach((input) => {
            input.value = section.inputs.find(
              (currentInput: Input) => currentInput.id == input.id,
            )!.value;
          });
      });
      updateData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateData = () => {
    // update data
    setData(data.copy());
    setLoading(false);
    console.log("just before update");

    //------------------------------ does this works and does it need to ------------------------------//
    // TODO
    document.querySelectorAll("textarea").forEach((elem) => {
      const nativeTAValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value",
      )!.set;
      const event = new Event("change", { bubbles: true });
      nativeTAValueSetter!.call(elem, elem.value + " ");
      elem.dispatchEvent(event);
      nativeTAValueSetter!.call(elem, elem.value.slice(0, -1));
      elem.dispatchEvent(event);
    });
  };

  const inputStates = data.sections.flatMap((section) =>
    section.inputs.map((input) => ({
      label: input.id,
    })),
  );

  const give_focus = (input: Input) => {
    // focus on the selected section
    const element = document.getElementById(input.id) as HTMLElement;
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
      element.focus();
    }
  };

  const validateFormInputs = () => {
    console.log("Validating form inputs... ");

    // Flag to track if all sections are approved
    const rejected: Input[] = [];
    // Iterate through each section and its inputs
    data.sections.forEach((section) => {
      section.inputs.forEach((input) => {
        // Check for specific validation criteria for each input
        if (input.property == "approved") {
          console.log(input.label + "Has been approved.");
        } else {
          if (input.value.trim().length > 0) {
            data.sections
              .find((currentSection) => currentSection.label == section.label)!
              .inputs.find(
                (currentInput) => currentInput.label == input.label,
              )!.property = "rejected";
            rejected.push(input);
            FormClickActions.emit("Rejected", input);
          }
        }
      });
    });
    if (rejected.length > 0) {
      give_focus(rejected[0]);
    }
    return rejected.length === 0;
  };

  // eslint-disable-next-line
  const submitForm = () => {
    const isValid = validateFormInputs();
    console.log(isValid);
    setData(data.copy());
    setState({ ...state, data: { pics: blobs, form: data } });
    if (isValid) {
      setState({ ...state, state: "validation" });
    }
  };


  const handleDataChange = (newSection: Section) => {
    const new_data = data.copy();
    new_data.sections.find((cur) => cur.label == newSection.label) !=
      newSection;
    setData(new_data);
    setState({ ...state, data: { pics: blobs, form: new_data } });
  };

  const handleModalStateChange = (isOpen: boolean) => {
    setIsAnyModalOpen(isOpen);
  };

  // Method to collect refs in inputs component
  const collectRefForm = (ref:HTMLDivElement) => {
    setFormDivRefs((prevRefs:HTMLDivElement[]) => {
      //console.log('Refs collectées:', prevRefs);
      calculateScrollBarPosition();
      return prevRefs.includes(ref) ? prevRefs : [...prevRefs, ref];
    });
  };

    // Method to collect refs in inputs component
    const collectRefScrollBarSection = (ref:HTMLDivElement) => {
      setScrollBarDivRefs((prevRefs:HTMLDivElement[]) => {
        //console.log('Refs collectées:', prevRefs);

        return prevRefs.includes(ref) ? prevRefs : [...prevRefs, ref];
      });
    };

  // Method to calculate the heights of the InputDivs
  const calculateScrollBarPosition = useCallback(() => {
    const inputHeights = FormDivRefs.map((divRef) => {
      return divRef.offsetHeight;
    });

    // Calcul here
    var LastModifiedDivIndex = FormDivRefs.findIndex((element) => element === lastModifiedDiv);
    var heightSingleSectionScrollBar = `${(window.innerHeight - 140) / inputStates.length}px`;
    //console.log("heightSingleSectionScrollBar:", heightSingleSectionScrollBar);

    //console.log('************Div modifiée:', LastModifiedDivIndex, 'Height is now:', inputHeights[LastModifiedDivIndex]);

    setInputsHeights(inputHeights);
  }, [FormDivRefs, ScrollBarDivRefs]);

    const scrollBarStyle = {
      transform: `translate(${scrollBarPosition.top}px)`,
    };


  // UseEffects
  useEffect(() => {
    textareas.forEach((textareaObj) => {
      if (textareaObj.ref.current) {
        resizeTextarea(textareaObj.ref.current);
      }
    });
    // eslint-disable-next-line
  }, [textareas]);

  // Prevent scrolling when a modal is open
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [isAnyModalOpen]);

  return (
    <StrictMode>
      <RefCollectorContext.Provider value={{ collectRefForm, collectRefScrollBarSection, setLastModifiedDiv }}>
      <div className="formPage-container ${theme}">
        <div className="pic-container">
          <Carousel imgs={urls}></Carousel>
        </div>
        <div className="data-container">
          {loading ? (
            <div className={`loader-container-form ${loading ? "active" : ""}`}>
              <div className="spinner"></div>
              <p>{t("analyzingText")}</p>
            </div>
          ) : (
            <div>
              {[...data.sections].map((sectionInfo: Section, key: number) => {
                return (
                  <SectionComponent
                    key={key}
                    sectionInfo={sectionInfo}
                    textareas={textareas}
                    modals={modals}
                    imgs={urls}
                    propagateChange={handleDataChange}
                    onModalStateChange={handleModalStateChange}
                  ></SectionComponent>
                );
              })}
            </div>
          )}
          <button className="button" onClick={submitForm}>
            {t("submitButton")}
          </button>
        </div>
        {!loading ? (
          <div className="progress-wrapper">
            <ProgressBar sections={inputStates} references={FormDivRefs} />
          </div>
        ) : (
          <></>
        )}
      </div>
      </RefCollectorContext.Provider>
    </StrictMode>
  );
};

export default FormPage;
